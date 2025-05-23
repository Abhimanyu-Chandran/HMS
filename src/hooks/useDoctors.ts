
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  bio?: string;
  image_url?: string;
}

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from('doctors')
          .select('id, name, speciality, bio, image_url');

        if (error) {
          throw error;
        }

        setDoctors(data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching doctors:', err);
        setError(err.message);
        // Only use mock data as absolute fallback
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return { doctors, loading, error };
};
