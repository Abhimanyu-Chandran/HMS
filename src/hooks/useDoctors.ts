
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
        // Try to fetch from doctors table first, fallback to mock data if table doesn't exist
        const { data, error } = await supabase
          .from('doctors')
          .select('id, name, speciality, bio, image_url');

        if (error) {
          console.warn('Doctors table not found, using mock data:', error);
          // Fallback to mock data
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
          setDoctors(mockDoctors);
        } else {
          setDoctors(data || []);
        }
      } catch (err: any) {
        console.warn('Error fetching doctors, using mock data:', err);
        // Fallback to mock data
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
        setDoctors(mockDoctors);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return { doctors, loading, error };
};
