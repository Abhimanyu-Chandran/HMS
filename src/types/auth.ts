
import { Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js';

// User profile data type
export interface UserProfileData {
  name: string;
  email: string;
  role: 'admin' | 'patient' | 'doctor';
  age?: number;
  diseases?: string[];
  disorders?: string[];
}

// Extended user type that combines Supabase User with profile data
export interface ExtendedUser extends SupabaseUser, UserProfileData {}

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
