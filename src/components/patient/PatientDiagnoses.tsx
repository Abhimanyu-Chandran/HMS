
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface PatientDiagnosesProps {
  userId?: string;
}

interface Diagnosis {
  id: string;
  condition: string;
  description: string;
  treatment: string;
  created_at: string;
  doctor_id: string;
}

const PatientDiagnoses: React.FC<PatientDiagnosesProps> = ({ userId }) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('diagnoses')
          .select('*')
          .eq('patient_id', userId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setDiagnoses(data || []);
      } catch (error) {
        console.error('Error fetching diagnoses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, [userId]);

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
        <CardTitle>Your Medical Diagnoses</CardTitle>
      </CardHeader>
      <CardContent>
        {diagnoses.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Treatment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diagnoses.map((diagnosis) => (
                <TableRow key={diagnosis.id}>
                  <TableCell>{new Date(diagnosis.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{diagnosis.condition}</TableCell>
                  <TableCell>{diagnosis.description || 'N/A'}</TableCell>
                  <TableCell>{diagnosis.treatment || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10">
            <p>No diagnoses found in your medical history.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientDiagnoses;
