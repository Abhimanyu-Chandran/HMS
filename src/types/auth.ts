
import { Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js';

// User profile data type
export interface UserProfileData {
  name: string;
  email: string; // Email is required in our user profile
  role: 'admin' | 'patient' | 'doctor';
  age?: number;
  diseases?: string[];
  disorders?: string[];
}

// Extended user type that combines Supabase User with profile data
// We Omit 'email' from SupabaseUser to use the 'email: string' from UserProfileData, resolving the conflict.
export interface ExtendedUser extends Omit<SupabaseUser, 'email' | 'role'>, UserProfileData {
  // Inherits 'id', 'aud', 'created_at', etc., from SupabaseUser (excluding 'email' and 'role')
  // Inherits 'name', 'email', 'role', 'age', 'diseases', 'disorders' from UserProfileData
}

// Auth context type
export interface AuthContextType {
  user: ExtendedUser | null;
  session: SupabaseSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, age?: number) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfileData>) => Promise<void>;
}

