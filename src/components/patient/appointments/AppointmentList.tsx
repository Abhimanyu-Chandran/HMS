
import React from 'react';
import { motion } from 'framer-motion';
import AppointmentItem from './AppointmentItem';

interface AppointmentListProps {
  appointments: Array<{
    id: string;
    doctorName: string;
    speciality: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    date: string;
    time: string;
  }>;
  expandedAppointment: string | null;
  onAppointmentClick: (id: string) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  expandedAppointment,
  onAppointmentClick
}) => {
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

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {appointments.map((appointment) => (
        <motion.div key={appointment.id} variants={item}>
          <AppointmentItem 
            appointment={appointment}
            isExpanded={expandedAppointment === appointment.id}
            onToggleExpand={onAppointmentClick}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AppointmentList;
