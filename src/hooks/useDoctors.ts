
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types'; // Assuming types.ts exports Tables

export type Doctor = Tables<'doctors'>;

const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('doctors')
          .select('*');

        if (fetchError) {
          throw fetchError;
        }
        setDoctors(data || []);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError(err);
        setDoctors([]); // Clear doctors on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return { doctors, isLoading, error };
};

export default useDoctors;
