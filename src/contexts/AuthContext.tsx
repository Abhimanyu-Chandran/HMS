
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast"; // Changed import path
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Combined User type for app state (Supabase Auth user + profile data)
interface UserProfileData {
  name: string;
  email: string;
  role: 'admin' | 'patient' | 'doctor';
  age?: number;
  diseases?: string[];
  disorders?: string[];
}

interface User extends SupabaseUser, UserProfileData {}

interface AuthContextType {
  user: User | null;
  session: SupabaseSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, age?: number) => Promise<void>;
  logout: () => Promise<void>; // Made async for consistency
  updateUserProfile: (data: Partial<UserProfileData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    setIsLoading(true);
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        await fetchAndSetUserProfile(currentSession.user);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user) {
          if (_event === 'SIGNED_IN') {
            await fetchAndSetUserProfile(currentSession.user);
            navigate('/'); // Navigate to home on successful sign-in
          } else if (_event === 'USER_UPDATED') {
            await fetchAndSetUserProfile(currentSession.user);
          }
        } else {
          setUser(null);
          if (_event === 'SIGNED_OUT') {
            navigate('/login'); // Navigate to login on sign-out
          }
        }
        // setIsLoading(false); // Handled by initial getSession
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]); // Added navigate to dependencies

  const fetchAndSetUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: 0 rows
        console.error('Error fetching user profile:', error);
        toast({ variant: "destructive", title: "Profile Error", description: "Could not fetch user profile." });
        setUser(mapSupabaseUserToAppUser(supabaseUser)); // Fallback to basic user
        return;
      }
      
      if (profileData) {
        setUser({
          ...supabaseUser, // Supabase user props (id, email, etc.)
          name: profileData.name,
          role: profileData.role as UserProfileData['role'],
          age: profileData.age,
          diseases: profileData.diseases,
          disorders: profileData.disorders,
        });
      } else {
         // Profile doesn't exist, this can happen if a user exists in auth.users but not user_profiles
         // Potentially create a default profile here or handle as an edge case
        console.warn(`Profile not found for user ${supabaseUser.id}. Setting basic user data.`);
        setUser(mapSupabaseUserToAppUser(supabaseUser, { name: supabaseUser.email?.split('@')[0] || 'User', role: 'patient'}));
      }
    } catch (e) {
      console.error('Exception fetching user profile:', e);
      toast({ variant: "destructive", title: "Profile Error", description: "An unexpected error occurred." });
      setUser(mapSupabaseUserToAppUser(supabaseUser));
    }
  };
  
  // Helper to map SupabaseUser to our app's User type, with optional profile defaults
  const mapSupabaseUserToAppUser = (supabaseUser: SupabaseUser, defaults?: Partial<UserProfileData>): User => {
    return {
      ...supabaseUser,
      name: defaults?.name || supabaseUser.email?.split('@')[0] || 'New User',
      email: supabaseUser.email || '', // SupabaseUser email is optional
      role: defaults?.role || 'patient',
      age: defaults?.age,
      diseases: defaults?.diseases || [],
      disorders: defaults?.disorders || [],
    };
  };


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
      // A trigger on auth.users is a more robust way to handle this (see Supabase docs)
      // but explicit insert is also common.
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
        // Potentially try to clean up the auth user if profile creation fails critically
        // For now, log and toast. The user is signed up in Supabase Auth.
        toast({ variant: "destructive", title: "Signup Incomplete", description: "Account created, but profile setup failed." });
      } else {
         toast({ title: "Account created", description: `Welcome, ${name}!` });
      }
      // onAuthStateChange should pick up the new user and session
      // navigate('/') is handled by onAuthStateChange for SIGNED_IN
      
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

  const updateUserProfile = async (profileUpdates: Partial<UserProfileData>) => {
    if (!user || !user.id) {
      toast({ variant: "destructive", title: "Update failed", description: "You must be logged in." });
      return;
    }
    
    // Optimistically update local state, or wait for DB update
    // For simplicity, we'll update DB then let onAuthStateChange or manual fetch update state.

    try {
      const updatePayload: any = { ...profileUpdates };
       // Ensure user_id is not part of the update payload to Supabase, it's the PK.
      delete updatePayload.id; 
      delete updatePayload.email; // Usually email is updated via Supabase Auth methods

      const { error } = await supabase
        .from('user_profiles')
        .update(updatePayload)
        .eq('user_id', user.id);

      if (error) throw error;

      // Re-fetch profile to update local state with confirmed changes
      await fetchAndSetUserProfile(user); // user here is SupabaseUser compatible

      toast({ title: "Profile updated", description: "Your profile has been successfully updated." });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "There was a problem updating your profile.",
      });
    }
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
