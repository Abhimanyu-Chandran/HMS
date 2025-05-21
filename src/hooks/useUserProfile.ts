
import { supabase } from '@/integrations/supabase/client';
import { UserProfileData } from '@/types/auth';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { mapSupabaseUserToAppUser } from '@/utils/authUtils';

export const useUserProfile = () => {
  const { toast } = useToast();

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: 0 rows
        console.error('Error fetching user profile:', error);
        toast({ 
          variant: "destructive", 
          title: "Profile Error", 
          description: "Could not fetch user profile." 
        });
        return mapSupabaseUserToAppUser(supabaseUser);
      }
      
      if (profileData) {
        return {
          ...supabaseUser,
          name: profileData.name,
          role: profileData.role as UserProfileData['role'],
          age: profileData.age,
          email: profileData.email,
          diseases: profileData.diseases,
          disorders: profileData.disorders,
        };
      } else {
        console.warn(`Profile not found for user ${supabaseUser.id}. Setting basic user data.`);
        return mapSupabaseUserToAppUser(
          supabaseUser, 
          { 
            name: supabaseUser.email?.split('@')[0] || 'User', 
            role: 'patient'
          }
        );
      }
    } catch (e) {
      console.error('Exception fetching user profile:', e);
      toast({ 
        variant: "destructive", 
        title: "Profile Error", 
        description: "An unexpected error occurred." 
      });
      return mapSupabaseUserToAppUser(supabaseUser);
    }
  };

  const updateUserProfile = async (userId: string, profileUpdates: Partial<UserProfileData>) => {
    if (!userId) {
      return { error: new Error('User ID is required for profile updates') };
    }
    
    try {
      const updatePayload = { ...profileUpdates };
      // Ensure user_id is not part of the update payload to Supabase, it's the PK.
      delete (updatePayload as any).id; 
      delete (updatePayload as any).email; // Usually email is updated via Supabase Auth methods

      const { error } = await supabase
        .from('user_profiles')
        .update(updatePayload)
        .eq('user_id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { error };
    }
  };

  return {
    fetchUserProfile,
    updateUserProfile
  };
};
