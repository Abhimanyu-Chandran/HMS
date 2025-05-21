
import React from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import PatientPageHeader from '@/components/patient/PatientPageHeader';
import PatientTabs from '@/components/patient/PatientTabs';

// Removed unused imports like useState, motion, specific tab components, etc.,
// as they are now handled within PatientPageHeader and PatientTabs.

const Patient: React.FC = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <Layout>
        <PatientPageHeader />
        <PatientTabs userId={user?.id} />
      </Layout>
    </ProtectedRoute>
  );
};

export default Patient;
