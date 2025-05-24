
import { useState, useEffect } from 'react';
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
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (caughtError: unknown) { // Changed from 'any' to 'unknown'
        console.error('Error fetching doctors:', caughtError);
        
        let errorMessage: string = 'Failed to fetch doctors'; // Default message
        // More robust error message extraction
        if (typeof caughtError === 'object' && caughtError !== null && 'message' in caughtError) {
          const potentialMessage = (caughtError as { message?: unknown }).message;
          if (typeof potentialMessage === 'string') {
            errorMessage = potentialMessage;
          }
        } else if (typeof caughtError === 'string') {
          errorMessage = caughtError;
        }
        
        setError(errorMessage); // Pass the extracted string message
        setDoctors(mockDoctors); // Fall back to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return { doctors, loading, error };
};
