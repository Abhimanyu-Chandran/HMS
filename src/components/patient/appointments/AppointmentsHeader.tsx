
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';

interface AppointmentsHeaderProps {
  onBookAppointment: () => void;
}

const AppointmentsHeader: React.FC<AppointmentsHeaderProps> = ({ onBookAppointment }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <CardTitle>Your Appointments</CardTitle>
      <Button 
        onClick={onBookAppointment} 
        className="bg-gradient-to-r from-hospital-primary to-hospital-secondary hover:opacity-90 transition-all"
      >
        Book New Appointment
      </Button>
    </div>
  );
};

export default AppointmentsHeader;
