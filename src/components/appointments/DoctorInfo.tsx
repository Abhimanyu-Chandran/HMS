
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useDoctors, { Doctor } from '@/hooks/useDoctors'; // Import the hook

interface DoctorInfoProps {
  doctorId: string; // UUID of the doctor
}

const DoctorInfo: React.FC<DoctorInfoProps> = ({ doctorId }) => {
  const { doctors, isLoading, error } = useDoctors();
  const doctor = doctorId ? doctors.find(d => d.id === doctorId) : null;

  if (!doctorId) {
     return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>Select a doctor to view their information.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hospital-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading doctor info...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-500">
          <p>Error loading doctor information.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!doctor) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>Doctor not found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
        <>
          <CardHeader className="pb-2">
            <CardTitle>Doctor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200">
                {doctor.image_url ? (
                  <img
                    src={doctor.image_url}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold">{doctor.name}</h3>
              <p className="text-hospital-primary mb-2">{doctor.speciality}</p>
              {/* Replace mock data fields like experience and patients with actual fields from Doctor type if available */}
              {/* For example, doctor.bio can be used */}
              {doctor.bio && (
                <p className="text-sm text-gray-600 text-center mb-4">
                  {doctor.bio}
                </p>
              )}
            </div>
          </CardContent>
        </>
    </Card>
  );
};

export default DoctorInfo;
