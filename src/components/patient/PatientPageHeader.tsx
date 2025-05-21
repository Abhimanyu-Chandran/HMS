
import React from 'react';
import { motion } from 'framer-motion';

const PatientPageHeader: React.FC = () => {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="page-title">My Health Information</h1>
      <p className="text-muted-foreground">
        View your profile, diagnoses, prescriptions, and appointments.
      </p>
    </motion.div>
  );
};

export default PatientPageHeader;
