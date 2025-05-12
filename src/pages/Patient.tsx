
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

const Patient = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mb-6">
          <h1 className="page-title">My Health Information</h1>
          <p className="text-muted-foreground">
            View your profile, diagnoses, prescriptions, and appointments.
          </p>
        </div>

        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>

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
        </Tabs>
      </Layout>
    </ProtectedRoute>
  );
};

export default Patient;
