
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is already logged in and fetch profile data
  useEffect(() => {
    const checkSession = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        // Try to fetch additional profile data from Supabase if available
        try {
          const { data: profileData, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', parsedUser.id)
            .single();
          
          if (profileData && !error) {
            // Merge the stored user data with the profile data from Supabase
            setUser({
              ...parsedUser,
              age: profileData.age || undefined,
              diseases: profileData.diseases || [],
              disorders: profileData.disorders || []
            });
          } else {
            setUser(parsedUser);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(parsedUser);
        }
      }
      setIsLoading(false);
    };
    
    checkSession();
  }, []);

  // In a real application, this would connect to your backend
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - In a real app, this would validate with a backend
      if (email === 'admin@hospital.com' && password === 'admin123') {
        const adminUser = { 
          id: '1', 
          name: 'Admin User', 
          email: 'admin@hospital.com',
          role: 'admin' as const
        };
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
        
        // Store in Supabase (upsert to handle both new and returning users)
        await supabase.from('user_profiles').upsert({
          user_id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          age: null,
          diseases: [],
          disorders: []
        }, { onConflict: 'user_id' });
        
        toast({
          title: "Login successful",
          description: "Welcome back, Admin!",
        });
      } else if (email && password) {
        // For demo purposes, any other combination logs in as a patient
        const regularUser = { 
          id: '2', 
          name: email.split('@')[0], 
          email: email,
          role: 'patient' as const
        };
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(regularUser));
        
        // Check if user already exists in Supabase
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', regularUser.id)
          .single();
        
        if (existingProfile) {
          // User exists, update with any new profile data
          setUser({
            ...regularUser,
            age: existingProfile.age || undefined,
            diseases: existingProfile.diseases || [],
            disorders: existingProfile.disorders || []
          });
        } else {
          // New user, create profile
          await supabase.from('user_profiles').insert({
            user_id: regularUser.id,
            name: regularUser.name,
            email: regularUser.email,
            role: regularUser.role,
            age: null,
            diseases: [],
            disorders: []
          });
          
          setUser(regularUser);
        }
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${regularUser.name}!`,
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, age?: number) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new user
      const newUser = { 
        id: Date.now().toString(), 
        name: name,
        email: email,
        role: 'patient' as const,
        age: age || undefined,
        diseases: [],
        disorders: []
      };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Store in Supabase
      await supabase.from('user_profiles').insert({
        user_id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        age: newUser.age || null,
        diseases: [],
        disorders: []
      });
      
      setUser(newUser);
      
      toast({
        title: "Account created",
        description: `Welcome to Hospital Management System, ${name}!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "There was a problem creating your account.",
      });
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...data };
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update Supabase
      await supabase.from('user_profiles').upsert({
        user_id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        age: updatedUser.age || null,
        diseases: updatedUser.diseases || [],
        disorders: updatedUser.disorders || []
      }, { onConflict: 'user_id' });
      
      setUser(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was a problem updating your profile.",
      });
      console.error('Profile update error:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
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
