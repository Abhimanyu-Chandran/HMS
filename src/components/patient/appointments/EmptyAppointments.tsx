
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyAppointmentsProps {
  onBookAppointment: () => void;
}

const EmptyAppointments: React.FC<EmptyAppointmentsProps> = ({ onBookAppointment }) => {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <h3 className="text-xl font-medium mb-2">No appointments found</h3>
        <p className="text-muted-foreground mb-6">
          You don't have any appointments scheduled.
        </p>
        <Button 
          onClick={onBookAppointment} 
          className="bg-gradient-to-r from-hospital-primary to-hospital-secondary hover:opacity-90 transition-all"
        >
          Book an Appointment
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyAppointments;
