
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
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
        
        // Transform data from DB format to the format expected by AppointmentCard
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
      } catch (error) {
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

    fetchAppointments();
  }, [userId, toast]);

  const navigateToBookAppointment = () => {
    navigate('/appointments');
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <CardTitle>Your Appointments</CardTitle>
        <Button onClick={navigateToBookAppointment} className="bg-hospital-primary hover:bg-hospital-secondary">
          Book New Appointment
        </Button>
      </div>

      {appointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-medium mb-2">No appointments found</h3>
            <p className="text-muted-foreground mb-6">
              You don't have any appointments scheduled.
            </p>
            <Button onClick={navigateToBookAppointment} className="bg-hospital-primary hover:bg-hospital-secondary">
              Book an Appointment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientAppointments;
