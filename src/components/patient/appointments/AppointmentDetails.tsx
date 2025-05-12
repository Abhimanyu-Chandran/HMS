
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface AppointmentDetailsProps {
  isVisible: boolean;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
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
  );
};

export default AppointmentDetails;
