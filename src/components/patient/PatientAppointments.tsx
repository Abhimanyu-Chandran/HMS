
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

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

  const handleAppointmentClick = (appointmentId: string) => {
    if (expandedAppointment === appointmentId) {
      setExpandedAppointment(null);
    } else {
      setExpandedAppointment(appointmentId);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <CardTitle>Your Appointments</CardTitle>
        <Button 
          onClick={navigateToBookAppointment} 
          className="bg-gradient-to-r from-hospital-primary to-hospital-secondary hover:opacity-90 transition-all"
        >
          Book New Appointment
        </Button>
      </div>

      {appointments.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {appointments.map((appointment) => (
            <motion.div key={appointment.id} variants={item}>
              <Card 
                className={`shadow-sm hover:shadow-md transition-all cursor-pointer border ${
                  expandedAppointment === appointment.id ? 'border-hospital-primary' : 'border-muted'
                }`}
                onClick={() => handleAppointmentClick(appointment.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{appointment.doctorName}</CardTitle>
                  <p className="text-sm text-hospital-primary">{appointment.speciality}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-2">
                    <Calendar className="mr-2 h-4 w-4 text-hospital-primary" />
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <Clock className="mr-2 h-4 w-4 text-hospital-primary" />
                    <span>{appointment.time}</span>
                  </div>
                  
                  <div className={`mt-2 text-sm ${
                    appointment.status === 'scheduled' ? 'text-blue-400' : 
                    appointment.status === 'completed' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    Status: {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </div>
                  
                  {expandedAppointment === appointment.id && (
                    <motion.div 
                      className="mt-4 pt-4 border-t border-muted"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="font-medium mb-2">Appointment Details</h4>
                      <p className="text-muted-foreground text-sm mb-2">
                        Please arrive 15 minutes before your scheduled appointment.
                      </p>
                      <p className="text-muted-foreground text-sm">
                        If you need to reschedule, please call our office at least 24 hours in advance.
                      </p>
                      
                      <div className="mt-4 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-hospital-primary text-hospital-primary"
                        >
                          Reschedule
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-medium mb-2">No appointments found</h3>
            <p className="text-muted-foreground mb-6">
              You don't have any appointments scheduled.
            </p>
            <Button 
              onClick={navigateToBookAppointment} 
              className="bg-gradient-to-r from-hospital-primary to-hospital-secondary hover:opacity-90 transition-all"
            >
              Book an Appointment
            </Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default PatientAppointments;
