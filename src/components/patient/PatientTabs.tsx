
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PatientSummary from '@/components/patient/PatientSummary';
import PatientProfile from '@/components/patient/PatientProfile';
import PatientDiagnoses from '@/components/patient/PatientDiagnoses';
import PatientPrescriptions from '@/components/patient/PatientPrescriptions';
import PatientAppointments from '@/components/patient/PatientAppointments';
import { motion } from 'framer-motion';

interface PatientTabsProps {
  userId?: string;
}

const tabContentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const PatientTabs: React.FC<PatientTabsProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
        <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
      </TabsList>

      <motion.div
        key={activeTab} // Key ensures animation runs on tab change
        initial="hidden"
        animate="visible"
        variants={tabContentVariants}
      >
        <TabsContent value="summary">
          <PatientSummary userId={userId} />
        </TabsContent>
        
        <TabsContent value="profile">
          <PatientProfile />
        </TabsContent>

        <TabsContent value="diagnoses">
          <PatientDiagnoses userId={userId} />
        </TabsContent>

        <TabsContent value="prescriptions">
          <PatientPrescriptions userId={userId} />
        </TabsContent> 

        <TabsContent value="appointments">
          <PatientAppointments userId={userId} />
        </TabsContent>
      </motion.div>
    </Tabs>
  );
};

export default PatientTabs;

