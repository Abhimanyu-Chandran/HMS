
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
        // Always use mock data for now since we're having issues with the doctors table
        console.log('Using mock doctors data');
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
          },
          {
            id: 'doc5',
            name: 'Dr. Sarah Davis',
            speciality: 'Dermatology',
            bio: 'Specializes in skin health and cosmetic procedures.',
            image_url: '/placeholder.svg'
          },
          {
            id: 'doc6',
            name: 'Dr. Michael Johnson',
            speciality: 'Psychiatry',
            bio: 'Mental health specialist with expertise in anxiety and depression.',
            image_url: '/placeholder.svg'
          },
          {
            id: 'doc7',
            name: 'Dr. Emily Chen',
            speciality: 'Oncology',
            bio: 'Cancer treatment specialist with 15 years of experience.',
            image_url: '/placeholder.svg'
          },
          {
            id: 'doc8',
            name: 'Dr. David Miller',
            speciality: 'Emergency Medicine',
            bio: 'Emergency room physician with trauma care expertise.',
            image_url: '/placeholder.svg'
          }
        ];
        setDoctors(mockDoctors);
      } catch (err: any) {
        console.warn('Error fetching doctors, using mock data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return { doctors, loading, error };
};
