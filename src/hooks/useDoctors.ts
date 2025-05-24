
import { useState as reactUseState, useEffect } from 'react'; // Alias useState
import { supabase } from '@/integrations/supabase/client';

export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  bio?: string;
  image_url?: string;
}

// Mock data to use as fallback
const mockDoctors: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. John Doe',
    speciality: 'Cardiology',
    bio: 'Experienced cardiologist with over 10 years of practice.',
    image_url: '/placeholder.svg'
  },
  {
    id: 'doc2',
    name: 'Dr. Jane Smith',
    speciality: 'Neurology',
    bio: 'Specializes in neurological disorders and advanced treatments.',
    image_url: '/placeholder.svg'
  },
  {
    id: 'doc3',
    name: 'Dr. Alice Brown',
    speciality: 'Pediatrics',
    bio: 'Dedicated to providing comprehensive care for children.',
    image_url: '/placeholder.svg'
  },
  {
    id: 'doc4',
    name: 'Dr. Robert Wilson',
    speciality: 'Orthopedics',
    bio: 'Expert in bone and joint health, and sports injuries.',
    image_url: '/placeholder.svg'
  }
];

export const useDoctors = () => {
  const [doctors, setDoctors] = reactUseState<Doctor[]>([]); // Use aliased useState
  const [loading, setLoading] = reactUseState(true);      // Use aliased useState
  const [error, setError] = reactUseState<string | null>(null); // Use aliased useState

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null); 
      try {
        const { data, error: rpcError } = await supabase.rpc('get_all_doctors');

        if (rpcError) {
          console.warn('RPC method get_all_doctors failed, falling back to mock data:', rpcError);
          const message = (rpcError && typeof rpcError.message === 'string') ? rpcError.message : 'Failed to fetch doctors via RPC.';
          setError(message);
          setDoctors(mockDoctors);
          return;
        }

        if (data && Array.isArray(data)) {
          setDoctors(data as Doctor[]);
        } else {
          console.warn('No data returned from get_all_doctors or data is not an array, using mock data');
          setError('Received invalid data format from server.');
          setDoctors(mockDoctors);
        }
      } catch (caughtError: unknown) {
        console.error('Error in fetchDoctors catch block:', caughtError);
        
        const simplifiedErrorMessage = 'An error occurred while fetching doctor data.';
        setError(simplifiedErrorMessage); 
        
        setDoctors(mockDoctors); 
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return { doctors, loading, error };
};

