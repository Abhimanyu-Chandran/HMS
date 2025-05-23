
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDoctors } from '@/hooks/useDoctors';

interface DoctorInfoProps {
  doctorId: string;
}

const DoctorInfo: React.FC<DoctorInfoProps> = ({ doctorId }) => {
  const { doctors, loading } = useDoctors();
  const doctor = doctorId ? doctors.find(d => d.id === doctorId) : null;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hospital-primary mx-auto"></div>
          <p className="mt-2">Loading doctor information...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {doctor ? (
        <>
          <CardHeader className="pb-2">
            <CardTitle>Doctor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
                {doctor.image_url ? (
                  <img
                    src={doctor.image_url}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-4xl font-bold">
                    {doctor.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold">{doctor.name}</h3>
              <p className="text-hospital-primary mb-2">{doctor.speciality}</p>
              {doctor.bio && (
                <p className="text-sm text-gray-600 text-center mb-4">
                  {doctor.bio}
                </p>
              )}
            </div>
          </CardContent>
        </>
      ) : (
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>Select a doctor to view their information.</p>
        </CardContent>
      )}
    </Card>
  );
};

export default DoctorInfo;
