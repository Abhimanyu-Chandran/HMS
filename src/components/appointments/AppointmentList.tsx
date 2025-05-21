
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppointmentCard from './AppointmentCard'; // Assuming this is still used for display
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';

interface AppointmentListProps {
  navigateToBooking: () => void;
}

type AppointmentWithDoctorDetails = Tables<'appointments'> & {
  doctors: Pick<Tables<'doctors'>, 'name' | 'speciality' | 'image_url'> | null;
};


const AppointmentList: React.FC<AppointmentListProps> = ({ navigateToBooking }) => {
  const { user, isLoading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentWithDoctorDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!user?.id || authLoading) {
      if (!authLoading) setIsLoading(false); // If auth is done loading and no user, stop loading appointments.
      return;
    }

    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch appointments and join with doctors table to get doctor's name and speciality
        const { data, error: fetchError } = await supabase
          .from('appointments')
          .select(`
            *,
            doctors (
              name,
              speciality,
              image_url
            )
          `)
          .eq('patient_id', user.id)
          .order('date', { ascending: false })
          .order('time', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }
        setAppointments(data as AppointmentWithDoctorDetails[] || []);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err);
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hospital-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">Error loading appointments: {error.message}</div>;
  }
  
  if (!user) {
     return (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-medium mb-2">Please Log In</h3>
            <p className="text-muted-foreground mb-6">
              Log in to view and manage your appointments.
            </p>
            {/* Optionally, add a login button or link here */}
          </CardContent>
        </Card>
     )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
      
      {appointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            // The AppointmentCard now needs to be adapted to AppointmentWithDoctorDetails or use its fields directly
            // For now, let's assume AppointmentCard can handle the structure or we'll need to adjust it
            <AppointmentCard 
              key={appointment.id} 
              appointment={{
                id: appointment.id,
                doctorName: appointment.doctors?.name || appointment.doctor_name || 'N/A', // Fallback if doctor join fails
                speciality: appointment.doctors?.speciality || appointment.speciality || 'N/A',
                date: appointment.date,
                time: appointment.time,
                status: appointment.status as 'scheduled' | 'completed' | 'cancelled', // Cast status
                // Add other necessary fields for AppointmentCard
                // e.g., patientId: appointment.patient_id, if needed by card
              }} 
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-medium mb-2">No appointments found</h3>
            <p className="text-muted-foreground mb-6">
              You don't have any appointments scheduled yet.
            </p>
            <Button onClick={navigateToBooking}>
              Book an Appointment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppointmentList;
