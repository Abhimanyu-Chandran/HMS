
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppointmentCard from './AppointmentCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AppointmentListProps {
  userId?: string;
  navigateToBooking: () => void;
}

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  speciality: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ userId, navigateToBooking }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', userId)
          .order('date', { ascending: true });

        if (error) throw error;

        // Transform data to match the expected format
        const transformedAppointments: Appointment[] = (data || []).map(appointment => ({
          id: appointment.id,
          patientId: appointment.patient_id,
          doctorId: appointment.doctor_id,
          doctorName: appointment.doctor_name,
          speciality: appointment.speciality,
          date: appointment.date,
          time: appointment.time,
          status: appointment.status,
          notes: appointment.notes || undefined
        }));

        setAppointments(transformedAppointments);
      } catch (error: any) {
        console.error('Error fetching appointments:', error);
        toast({
          variant: "destructive",
          title: "Failed to load appointments",
          description: error.message || "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hospital-primary"></div>
        <p className="ml-3">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
      
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
