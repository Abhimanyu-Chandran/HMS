
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface PatientPrescriptionsProps {
  userId?: string;
}

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  instructions: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

const PatientPrescriptions: React.FC<PatientPrescriptionsProps> = ({ userId }) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('prescriptions')
          .select('*')
          .eq('patient_id', userId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setPrescriptions(data || []);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [userId]);

  const isActive = (endDate: string): boolean => {
    const today = new Date();
    const end = new Date(endDate);
    return end >= today;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Prescriptions</CardTitle>
      </CardHeader>
      <CardContent>
        {prescriptions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Instructions</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell className="font-medium">{prescription.medication}</TableCell>
                  <TableCell>{prescription.dosage}</TableCell>
                  <TableCell>{prescription.instructions || 'N/A'}</TableCell>
                  <TableCell>
                    {new Date(prescription.start_date).toLocaleDateString()} - {new Date(prescription.end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {isActive(prescription.end_date) ? (
                      <Badge className="bg-green-500">Active</Badge>
                    ) : (
                      <Badge variant="outline">Completed</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10">
            <p>No prescriptions found in your medical history.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientPrescriptions;
