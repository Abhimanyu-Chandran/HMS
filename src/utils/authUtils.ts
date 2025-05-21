
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserProfileData, ExtendedUser } from '@/types/auth';

// Helper to map SupabaseUser to our app's User type, with optional profile defaults
export const mapSupabaseUserToAppUser = (
  supabaseUser: SupabaseUser, 
  defaults?: Partial<UserProfileData>
): ExtendedUser => {
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
