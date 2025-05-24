
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'patient' | 'doctor';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
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
        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
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
        localStorage.setItem('user', JSON.stringify(regularUser));
        setUser(regularUser);
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

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new user
      const newUser = { 
        id: Date.now().toString(), 
        name: name,
        email: email,
        role: 'patient' as const
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
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
