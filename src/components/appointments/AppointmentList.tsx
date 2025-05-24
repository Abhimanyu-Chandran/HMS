
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppointmentCard from './AppointmentCard';
import { appointments } from '@/data/mockData';

interface AppointmentListProps {
  userId?: string;
  navigateToBooking: () => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ userId, navigateToBooking }) => {
  // Filter appointments for current user
  const userAppointments = userId
    ? appointments.filter(apt => apt.patientId === userId)
    : [];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
      
      {userAppointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userAppointments.map((appointment) => (
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
