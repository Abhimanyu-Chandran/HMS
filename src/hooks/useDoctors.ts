
import React, { useState, useEffect } from 'react'; // Ensure React is imported if using React.useState
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
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [loading, setLoading] = React.useState(true);
  // Explicitly use React.useState and ensure the type is string | null
  const [error, setError] = React.useState<string | null>(null); 

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null); // Reset error state at the beginning
      try {
        const { data, error: rpcError } = await supabase.rpc('get_all_doctors');

        if (rpcError) {
          console.warn('RPC method get_all_doctors failed, falling back to mock data:', rpcError);
          // Ensure message is a string
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
        
        let extractedMessage: string = 'Failed to fetch doctors due to an unexpected error.'; // Default/fallback message
        
        if (typeof caughtError === 'object' && caughtError !== null) {
          // Check if 'message' property exists and is a string
          if ('message' in caughtError && typeof (caughtError as { message?: unknown }).message === 'string') {
            extractedMessage = (caughtError as { message: string }).message;
          }
        } else if (typeof caughtError === 'string') {
          extractedMessage = caughtError;
        }
        
        setError(extractedMessage); // This is line 55 (approx.)
        setDoctors(mockDoctors); // Fallback to mock data on error
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return { doctors, loading, error };
};

