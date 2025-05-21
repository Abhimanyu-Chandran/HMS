
import React, { useState } from 'react';
// useNavigate is not used here anymore, can be removed if not needed for other future functionality
// import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
// useAuth is used by child components, not directly here unless needed for conditional rendering
// import { useAuth } from '@/contexts/AuthContext'; 
import AppointmentForm from '@/components/appointments/AppointmentForm';
import DoctorInfo from '@/components/appointments/DoctorInfo';
import AppointmentList from '@/components/appointments/AppointmentList';

const Appointments = () => {
  // const { user } = useAuth(); // Not directly needed here anymore
  // const navigate = useNavigate(); // Not used
  const [selectedDoctor, setSelectedDoctor] = useState(''); // UUID of the doctor

  // Function to navigate to booking tab by simulating a click
  const navigateToBooking = () => {
    // Query for the button element that acts as the tab trigger
    const bookTabTrigger = document.querySelector('button[data-state][role="tab"][value="book"]');
    if (bookTabTrigger instanceof HTMLElement) {
      bookTabTrigger.click(); // Simulate click to switch tab
    } else {
      console.warn("Could not find 'Book Appointment' tab trigger to click.");
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
                  // user prop removed
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
              // userId prop removed
              navigateToBooking={navigateToBooking} 
            />
          </TabsContent>
        </Tabs>
      </Layout>
    </ProtectedRoute>
  );
};

export default Appointments;
