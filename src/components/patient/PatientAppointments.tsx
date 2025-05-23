
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

// Import the new component files
import AppointmentLoading from './appointments/AppointmentLoading';
import EmptyAppointments from './appointments/EmptyAppointments';
import AppointmentList from './appointments/AppointmentList';
import AppointmentsHeader from './appointments/AppointmentsHeader';

interface PatientAppointmentsProps {
  userId?: string;
}

// Define interface to match the Supabase database structure
interface AppointmentFromDB {
  id: string;
  doctor_name: string;
  speciality: string;
  status: string;
  date: string;
  time: string;
  notes?: string;
  patient_id: string;
  doctor_id: string;
  created_at: string;
  updated_at: string;
}

// Define interface to match what the AppointmentCard component expects
interface Appointment {
  id: string;
  doctorName: string;
  speciality: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  date: string;
  time: string;
}

const PatientAppointments: React.FC<PatientAppointmentsProps> = ({ userId }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchAppointments = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Using userId to fetch appointments for the current user
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', userId)
        .order('date', { ascending: true });
        
      if (error) throw error;
      
      // Transform data from DB format to the format expected by AppointmentItem
      const transformedAppointments: Appointment[] = (data || []).map((appointment: AppointmentFromDB) => ({
        id: appointment.id,
        doctorName: appointment.doctor_name,
        speciality: appointment.speciality,
        // Ensure the status is one of the allowed values
        status: appointment.status === 'scheduled' || 
               appointment.status === 'completed' || 
               appointment.status === 'cancelled' 
               ? appointment.status as 'scheduled' | 'completed' | 'cancelled' 
               : 'scheduled',
        date: appointment.date,
        time: appointment.time,
      }));
      
      setAppointments(transformedAppointments);
      console.log('Fetched appointments:', transformedAppointments);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      toast({
        variant: "destructive",
        title: "Failed to load appointments",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    // Set up real-time subscription for appointments
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `patient_id=eq.${userId}`
        },
        () => {
          // Refetch appointments when there's a change
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, toast]);

  const navigateToBookAppointment = () => {
    navigate('/appointments');
  };

  const handleAppointmentClick = (appointmentId: string) => {
    if (expandedAppointment === appointmentId) {
      setExpandedAppointment(null);
    } else {
      setExpandedAppointment(appointmentId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AppointmentsHeader onBookAppointment={navigateToBookAppointment} />

      {loading ? (
        <AppointmentLoading />
      ) : appointments.length > 0 ? (
        <AppointmentList 
          appointments={appointments} 
          expandedAppointment={expandedAppointment}
          onAppointmentClick={handleAppointmentClick}
        />
      ) : (
        <EmptyAppointments onBookAppointment={navigateToBookAppointment} />
      )}
    </motion.div>
  );
};

export default PatientAppointments;
