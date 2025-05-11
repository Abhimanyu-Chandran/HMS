
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarClock, FileText, PillIcon, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface PatientSummaryProps {
  userId?: string;
}

const PatientSummary: React.FC<PatientSummaryProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({
    diagnoses: 0,
    prescriptions: 0,
    upcomingAppointments: 0,
    latestAppointment: null as any,
    latestDiagnosis: null as any,
  });

  useEffect(() => {
    const fetchSummaryData = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        // Fetch diagnoses count
        const { count: diagnosesCount } = await supabase
          .from('diagnoses')
          .select('*', { count: 'exact', head: true })
          .eq('patient_id', userId);

        // Fetch prescriptions count
        const { count: prescriptionsCount } = await supabase
          .from('prescriptions')
          .select('*', { count: 'exact', head: true })
          .eq('patient_id', userId);

        // Fetch upcoming appointments count
        const { count: appointmentsCount, data: appointments } = await supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', userId)
          .eq('status', 'scheduled')
          .gt('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true });

        // Fetch latest diagnosis
        const { data: latestDiagnosis } = await supabase
          .from('diagnoses')
          .select('*')
          .eq('patient_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        setSummaryData({
          diagnoses: diagnosesCount || 0,
          prescriptions: prescriptionsCount || 0,
          upcomingAppointments: appointmentsCount || 0,
          latestAppointment: appointments && appointments.length > 0 ? appointments[0] : null,
          latestDiagnosis,
        });
      } catch (error) {
        console.error('Error fetching summary data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, [userId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/2 mb-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5 text-hospital-primary" />
              Diagnoses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {summaryData.diagnoses}
            </div>
            <p className="text-sm text-muted-foreground">
              Total diagnoses in your medical history
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <PillIcon className="mr-2 h-5 w-5 text-hospital-primary" />
              Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {summaryData.prescriptions}
            </div>
            <p className="text-sm text-muted-foreground">
              Active and past medication prescriptions
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CalendarClock className="mr-2 h-5 w-5 text-hospital-primary" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {summaryData.upcomingAppointments}
            </div>
            <p className="text-sm text-muted-foreground">
              Scheduled appointments with your doctors
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {summaryData.latestAppointment && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarClock className="mr-2 h-5 w-5 text-hospital-primary" />
                Next Appointment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Doctor:</span> {summaryData.latestAppointment.doctor_name}
                </div>
                <div>
                  <span className="font-medium">Speciality:</span> {summaryData.latestAppointment.speciality}
                </div>
                <div>
                  <span className="font-medium">Date:</span> {new Date(summaryData.latestAppointment.date).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Time:</span> {summaryData.latestAppointment.time}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {summaryData.latestDiagnosis && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-hospital-primary" />
                Latest Diagnosis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Condition:</span> {summaryData.latestDiagnosis.condition}
                </div>
                {summaryData.latestDiagnosis.description && (
                  <div>
                    <span className="font-medium">Description:</span> {summaryData.latestDiagnosis.description}
                  </div>
                )}
                {summaryData.latestDiagnosis.treatment && (
                  <div>
                    <span className="font-medium">Treatment:</span> {summaryData.latestDiagnosis.treatment}
                  </div>
                )}
                <div>
                  <span className="font-medium">Date:</span> {new Date(summaryData.latestDiagnosis.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {!summaryData.latestAppointment && !summaryData.latestDiagnosis && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No recent health information found. Please visit the Appointments section to schedule your first appointment.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PatientSummary;
