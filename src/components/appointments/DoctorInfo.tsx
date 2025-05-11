
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { doctors } from '@/data/mockData';

interface DoctorInfoProps {
  doctorId: string;
}

const DoctorInfo: React.FC<DoctorInfoProps> = ({ doctorId }) => {
  const doctor = doctorId ? doctors.find(d => d.id === doctorId) : null;

  return (
    <Card>
      {doctor ? (
        <>
          <CardHeader className="pb-2">
            <CardTitle>Doctor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold">{doctor.name}</h3>
              <p className="text-hospital-primary mb-2">{doctor.speciality}</p>
              <div className="flex items-center mb-4 text-sm text-gray-500">
                <span>{doctor.experience} years experience</span>
                <span className="mx-2">•</span>
                <span>{doctor.patients}+ patients</span>
              </div>
              <p className="text-sm text-gray-600 text-center mb-4">
                {doctor.about}
              </p>
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
