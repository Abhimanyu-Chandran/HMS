
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session as SupabaseSession } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, ExtendedUser, UserProfileData } from '@/types/auth';
import { useUserProfile } from '@/hooks/useUserProfile';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { fetchUserProfile, updateUserProfile } = useUserProfile();

  useEffect(() => {
    setIsLoading(true);
    
    // Get the initial session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        const userWithProfile = await fetchUserProfile(currentSession.user);
        setUser(userWithProfile);
      }
      setIsLoading(false);
    });

    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user) {
          if (_event === 'SIGNED_IN') {
            const userWithProfile = await fetchUserProfile(currentSession.user);
            setUser(userWithProfile);
            navigate('/'); // Navigate to home on successful sign-in
          } else if (_event === 'USER_UPDATED') {
            const userWithProfile = await fetchUserProfile(currentSession.user);
            setUser(userWithProfile);
          }
        } else {
          setUser(null);
          if (_event === 'SIGNED_OUT') {
            navigate('/login'); // Navigate to login on sign-out
          }
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate, fetchUserProfile]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      if (data.user && data.session) {
        // onAuthStateChange will handle fetching profile and setting user/session state
        toast({ title: "Login successful", description: "Welcome back!" });
        // navigate('/') is handled by onAuthStateChange
      } else {
        throw new Error('Login failed: No user data returned.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, age?: number) => {
    setIsLoading(true);
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name: name, // Store name in user_metadata for potential trigger use
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error("Signup successful but no user data returned.");

      // Determine role
      const role: UserProfileData['role'] = email === 'admin@hospital.com' ? 'admin' : 'patient';

      // Insert into user_profiles table
      const { error: profileError } = await supabase.from('user_profiles').insert({
        user_id: signUpData.user.id, // This is the UUID from Supabase Auth
        name,
        email,
        role,
        age: age || null,
        diseases: [],
        disorders: []
      });

      if (profileError) {
        console.error("Error creating profile after signup:", profileError);
        toast({ 
          variant: "destructive", 
          title: "Signup Incomplete", 
          description: "Account created, but profile setup failed." 
        });
      } else {
         toast({ title: "Account created", description: `Welcome, ${name}!` });
      }
      // onAuthStateChange should pick up the new user and session
      
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "There was a problem creating your account.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileUpdates: Partial<UserProfileData>) => {
    if (!user || !user.id) {
      toast({ 
        variant: "destructive", 
        title: "Update failed", 
        description: "You must be logged in." 
      });
      return;
    }
    
    const { error } = await updateUserProfile(user.id, profileUpdates);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "There was a problem updating your profile.",
      });
      return;
    }
    
    // Re-fetch profile to update local state with confirmed changes
    if (user) {
      const updatedUser = await fetchUserProfile(user);
      setUser(updatedUser);
    }
    
    toast({ 
      title: "Profile updated", 
      description: "Your profile has been successfully updated." 
    });
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // onAuthStateChange will handle clearing user/session and navigation
      toast({ title: "Logged out", description: "You have been successfully logged out." });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message || "Could not log out.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!session?.user,
    isLoading,
    login,
    signup,
    logout,
    updateUserProfile: updateProfile
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
