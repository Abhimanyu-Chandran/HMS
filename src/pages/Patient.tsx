
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import PatientDiagnoses from '@/components/patient/PatientDiagnoses';
import PatientPrescriptions from '@/components/patient/PatientPrescriptions';
import PatientAppointments from '@/components/patient/PatientAppointments';
import PatientSummary from '@/components/patient/PatientSummary';
import PatientProfile from '@/components/patient/PatientProfile';
import { motion } from 'framer-motion';

const Patient = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('summary');

  // Animation variants for tab content
  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <ProtectedRoute>
      <Layout>
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

        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            variants={tabContentVariants}
          >
            <TabsContent value="summary">
              <PatientSummary userId={user?.id} />
            </TabsContent>
            
            <TabsContent value="profile">
              <PatientProfile />
            </TabsContent>

            <TabsContent value="diagnoses">
              <PatientDiagnoses userId={user?.id} />
            </TabsContent>

            <TabsContent value="prescriptions">
              <PatientPrescriptions userId={user?.id} />
            </TabsContent>

            <TabsContent value="appointments">
              <PatientAppointments userId={user?.id} />
            </TabsContent>
          </motion.div>
        </Tabs>
      </Layout>
    </ProtectedRoute>
  );
};

export default Patient;
