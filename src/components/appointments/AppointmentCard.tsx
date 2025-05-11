
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';

interface AppointmentCardProps {
  appointment: {
    id: string;
    doctorName: string;
    speciality: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    date: string;
    time: string;
  };
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  return (
    <Card key={appointment.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{appointment.doctorName}</CardTitle>
            <p className="text-sm text-muted-foreground">{appointment.speciality}</p>
          </div>
          {(() => {
            switch (appointment.status) {
              case 'scheduled':
                return <Badge className="bg-blue-500">Scheduled</Badge>;
              case 'completed':
                return <Badge className="bg-green-500">Completed</Badge>;
              case 'cancelled':
                return <Badge variant="destructive">Cancelled</Badge>;
              default:
                return null;
            }
          })()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Date:</span>
            <span className="text-sm">{appointment.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Time:</span>
            <span className="text-sm">{appointment.time}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {appointment.status === 'scheduled' && (
          <div className="flex space-x-2 w-full">
            <Button variant="outline" className="flex-1">Reschedule</Button>
            <Button variant="destructive" className="flex-1">Cancel</Button>
          </div>
        )}
        {appointment.status === 'completed' && (
          <Button variant="outline" className="w-full">View Details</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AppointmentCard;
