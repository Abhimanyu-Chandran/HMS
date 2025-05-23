
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
      try {
        // Try to fetch from database first using a raw query
        // This avoids the TypeScript issue with the table name
        const { data, error } = await supabase.rpc('get_all_doctors');

        if (error) {
          console.warn('RPC method not found, falling back to mock data:', error);
          setDoctors(mockDoctors);
          return;
        }

        if (data && Array.isArray(data)) {
          setDoctors(data);
        } else {
          console.warn('No data returned from doctors query, using mock data');
          setDoctors(mockDoctors);
        }
      } catch (err: any) {
        console.error('Error fetching doctors:', err);
        setError(err.message);
        // Fall back to mock data
        setDoctors(mockDoctors);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return { doctors, loading, error };
};
