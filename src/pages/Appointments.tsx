
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import DoctorInfo from '@/components/appointments/DoctorInfo';
import AppointmentList from '@/components/appointments/AppointmentList';

const Appointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState('');

  // Function to navigate to booking tab
  const navigateToBooking = () => {
    const bookTabElement = document.querySelector('button[value="book"]');
    if (bookTabElement) {
      (bookTabElement as HTMLButtonElement).click();
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mb-6">
          <h1 className="page-title">Appointments</h1>
          <p className="text-muted-foreground">
            Book and manage your medical appointments.
          </p>
        </div>

        <Tabs defaultValue="book">
          <TabsList className="mb-6">
            <TabsTrigger value="book">Book Appointment</TabsTrigger>
            <TabsTrigger value="manage">My Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="book">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AppointmentForm 
                  user={user} 
                  selectedDoctor={selectedDoctor}
                  onDoctorSelect={setSelectedDoctor}
                />
              </div>

              <div>
                <DoctorInfo doctorId={selectedDoctor} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manage">
            <AppointmentList 
              userId={user?.id} 
              navigateToBooking={navigateToBooking} 
            />
          </TabsContent>
        </Tabs>
      </Layout>
    </ProtectedRoute>
  );
};

export default Appointments;
