
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import AppointmentDetails from './AppointmentDetails';

interface AppointmentItemProps {
  appointment: {
    id: string;
    doctorName: string;
    speciality: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    date: string;
    time: string;
  };
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ 
  appointment,
  isExpanded,
  onToggleExpand
}) => {
  return (
    <Card 
      className={`shadow-sm hover:shadow-md transition-all cursor-pointer border ${
        isExpanded ? 'border-hospital-primary' : 'border-muted'
      }`}
      onClick={() => onToggleExpand(appointment.id)}
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
        
        <AppointmentDetails isVisible={isExpanded} />
      </CardContent>
    </Card>
  );
};

export default AppointmentItem;
