
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface UserProfile {
  id: string; // This will be the Supabase auth user ID
  name: string;
  email: string;
  role: 'admin' | 'patient' | 'doctor';
  age?: number;
  diseases?: string[];
  disorders?: string[];
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, age?: number) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      setIsLoading(true);
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Error getting session:', sessionError);
        setIsLoading(false);
        return;
      }

      setSession(currentSession);
      
      if (currentSession?.user) {
        await loadUserProfile(currentSession.user);
      } else {
        setUser(null); // Clear user if no session
      }
      setIsLoading(false);
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (event === 'SIGNED_IN' && newSession?.user) {
        await loadUserProfile(newSession.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      // For other events like USER_UPDATED, TOKEN_REFRESHED, etc.
      // you might want to reload profile if necessary.
      if (event === 'USER_UPDATED' && newSession?.user) {
        await loadUserProfile(newSession.user);
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: single row not found
        throw error;
      }

      if (profileData) {
        setUser({
          id: profileData.user_id,
          name: profileData.name,
          email: profileData.email,
          role: profileData.role as 'admin' | 'patient' | 'doctor',
          age: profileData.age || undefined,
          diseases: profileData.diseases || [],
          disorders: profileData.disorders || []
        });
      } else {
        // This case might happen if user_profiles entry wasn't created, or if direct email isn't in user_profiles yet.
        // Fallback or create a default profile. For now, we'll use authUser details.
        console.warn(`No profile found for user ${authUser.id}. Using auth email.`);
        setUser({
          id: authUser.id,
          name: authUser.email?.split('@')[0] || 'User',
          email: authUser.email || '',
          role: 'patient', // Default role
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast({
        variant: "destructive",
        title: "Profile Error",
        description: "Could not load your profile.",
      });
      setUser(null); // Clear user on profile load error
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // onAuthStateChange will handle setting user and session
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
      });
      console.error('Login error:', error);
      throw error; // Re-throw to be caught by UI
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, age?: number) => {
    setIsLoading(true);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name: name, // Store name in user_metadata if needed by triggers
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Signup successful but no user data returned.");

      // Insert into user_profiles table
      const { error: profileError } = await supabase.from('user_profiles').insert({
        user_id: authData.user.id,
        name: name,
        email: email,
        role: 'patient', // Default role
        age: age || null,
        diseases: [],
        disorders: []
      });

      if (profileError) {
        // If profile creation fails, it's a critical issue.
        // You might want to attempt to delete the auth user or log this.
        console.error("Error creating user profile after signup:", profileError);
        throw new Error("Account created, but profile setup failed. Please contact support.");
      }
      
      // Manually call loadUserProfile as onAuthStateChange might not have new profile yet
      await loadUserProfile(authData.user);

      toast({
        title: "Account created",
        description: `Welcome, ${name}! Please check your email to verify your account.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "There was a problem creating your account.",
      });
      console.error('Signup error:', error);
      throw error; // Re-throw to be caught by UI
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user?.id) {
      toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to update your profile." });
      return;
    }
    
    try {
      const updateData: any = { ...data };
      delete updateData.id; // user_id is the primary key and shouldn't be in the update payload like this

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh local user state
      if (session?.user) {
        await loadUserProfile(session.user);
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "There was a problem updating your profile.",
      });
      console.error('Profile update error:', error);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message,
      });
      console.error('Logout error:', error);
    } else {
      setUser(null);
      setSession(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
    setIsLoading(false);
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user && !!session, // Check both user profile and session
    isLoading,
    login,
    signup,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
