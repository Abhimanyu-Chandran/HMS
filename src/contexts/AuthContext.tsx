
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'patient' | 'doctor';
  age?: number;
  diseases?: string[];
  disorders?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, age?: number) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from our custom table
          try {
            const { data: profile, error } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            if (profile && !error) {
              setUser({
                id: session.user.id,
                name: profile.name,
                email: profile.email,
                role: profile.role as 'admin' | 'patient' | 'doctor',
                age: profile.age || undefined,
                diseases: profile.diseases || [],
                disorders: profile.disorders || []
              });
            } else if (error && error.code === 'PGRST116') {
              // Profile doesn't exist, create one
              const newProfile = {
                user_id: session.user.id,
                name: session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
                role: 'patient',
                age: null,
                diseases: [],
                disorders: []
              };
              
              await supabase.from('user_profiles').insert(newProfile);
              
              setUser({
                id: session.user.id,
                name: newProfile.name,
                email: newProfile.email,
                role: 'patient',
                diseases: [],
                disorders: []
              });
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // The listener above will handle the session
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
    } catch (error: any) {
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            age: age
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        await supabase.from('user_profiles').insert({
          user_id: data.user.id,
          name: name,
          email: email,
          role: 'patient',
          age: age || null,
          diseases: [],
          disorders: []
        });
      }

      toast({
        title: "Account created",
        description: `Welcome to Hospital Management System, ${name}!`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "There was a problem creating your account.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user || !session) return;
    
    try {
      const updatedProfile = { ...user, ...data };
      
      await supabase.from('user_profiles').upsert({
        user_id: user.id,
        name: updatedProfile.name,
        email: updatedProfile.email,
        role: updatedProfile.role,
        age: updatedProfile.age || null,
        diseases: updatedProfile.diseases || [],
        disorders: updatedProfile.disorders || []
      }, { onConflict: 'user_id' });
      
      setUser(updatedProfile);
      
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
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message || "There was a problem logging out.",
      });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
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
