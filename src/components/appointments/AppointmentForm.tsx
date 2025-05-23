
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { useDoctors, type Doctor } from '@/hooks/useDoctors';
import { useSpecialities } from '@/hooks/useSpecialities';

interface AppointmentFormProps {
  user: any;
  selectedDoctor: string;
  onDoctorSelect: (doctorId: string) => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  user, 
  selectedDoctor, 
  onDoctorSelect 
}) => {
  const { toast } = useToast();
  const { doctors, loading: doctorsLoading } = useDoctors();
  const { data: specialitiesData, isLoading: specialitiesLoading } = useSpecialities();
  
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formComplete, setFormComplete] = useState(false);

  // Get unique specialities from doctors and specialities table
  const doctorSpecialities = [...new Set(doctors.map(doctor => doctor.speciality))];
  const dbSpecialities = specialitiesData?.map(s => s.name) || [];
  const allSpecialities = ['all', ...new Set([...doctorSpecialities, ...dbSpecialities])];

  // Filter doctors based on selected speciality
  const filteredDoctors = selectedSpeciality && selectedSpeciality !== 'all'
    ? doctors.filter(doctor => doctor.speciality === selectedSpeciality)
    : doctors;

  // Define available time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  // Check if form is complete to enable button
  useEffect(() => {
    if (selectedDoctor && selectedDate && selectedTime) {
      setFormComplete(true);
    } else {
      setFormComplete(false);
    }
  }, [selectedDoctor, selectedDate, selectedTime]);

  const handleBookAppointment = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to book an appointment.",
      });
      return;
    }

    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a doctor, date, and time.",
      });
      return;
    }

    const selectedDoctorDetails = doctors.find(d => d.id === selectedDoctor);
    if (!selectedDoctorDetails) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Selected doctor not found.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format the date as ISO string but only take the date part
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      // Get user ID - use auth user id if available, otherwise use mock user id
      const userId = user.id || user.user_id || 'mock-user-1';
      
      // Save appointment to the database
      const appointmentData = {
        patient_id: userId,
        doctor_id: selectedDoctorDetails.id,
        doctor_name: selectedDoctorDetails.name,
        speciality: selectedDoctorDetails.speciality,
        date: formattedDate,
        time: selectedTime,
        status: 'scheduled',
        notes: reason || null
      };

      console.log('Booking appointment with data:', appointmentData);

      const { data, error } = await supabase.from('appointments').insert(appointmentData);

      if (error) {
        throw error;
      }
      
      toast({
        title: "Appointment Booked",
        description: `Your appointment with ${selectedDoctorDetails.name} on ${format(selectedDate, 'PPP')} at ${selectedTime} has been scheduled.`,
      });
  
      // Reset form
      onDoctorSelect('');
      setSelectedSpeciality('');
      setSelectedDate(undefined);
      setSelectedTime('');
      setReason('');
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: error.message || "There was a problem booking your appointment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (doctorsLoading || specialitiesLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hospital-primary mx-auto"></div>
          <p className="mt-2">Loading doctors and specialities...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>New Appointment</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Speciality Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Speciality</label>
            <Select value={selectedSpeciality} onValueChange={setSelectedSpeciality}>
              <SelectTrigger className="border-hospital-primary/30 focus:border-hospital-primary">
                <SelectValue placeholder="Select a speciality" />
              </SelectTrigger>
              <SelectContent>
                {allSpecialities.map((speciality) => (
                  <SelectItem key={speciality} value={speciality}>
                    {speciality === 'all' ? "All Specialities" : speciality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Doctor Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Doctor</label>
            <Select 
              value={selectedDoctor} 
              onValueChange={onDoctorSelect}
              disabled={filteredDoctors.length === 0}
            >
              <SelectTrigger className="border-hospital-primary/30 focus:border-hospital-primary">
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {filteredDoctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.speciality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    selectedDate ? "border-hospital-primary/30" : ""
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    // Disable past dates and weekends
                    const day = date.getDay();
                    return (
                      date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                      day === 0 ||
                      day === 6
                    );
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Time Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Time</label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="border-hospital-primary/30 focus:border-hospital-primary">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Reason for Visit */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for Visit</label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your symptoms or reason for visit"
              className="border-hospital-primary/30 focus:border-hospital-primary"
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button 
            className={`w-full ${
              formComplete 
                ? "bg-gradient-to-r from-hospital-primary to-hospital-secondary hover:opacity-90" 
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
            onClick={handleBookAppointment}
            disabled={isSubmitting || !formComplete}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Booking...
              </div>
            ) : 'Book Appointment'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AppointmentForm;
