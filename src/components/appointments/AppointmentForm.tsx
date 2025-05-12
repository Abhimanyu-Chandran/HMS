
import React, { useState } from 'react';
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
import { useToast } from "@/hooks/use-toast";
import { doctors } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';

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
  
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get unique specialities
  const specialities = ['all', ...new Set(doctors.map(doctor => doctor.speciality))];

  // Filter doctors based on selected speciality
  const filteredDoctors = selectedSpeciality && selectedSpeciality !== 'all'
    ? doctors.filter(doctor => doctor.speciality === selectedSpeciality)
    : doctors;

  // Define available time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

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
      
      // Save appointment to the database
      const { data, error } = await supabase.from('appointments').insert({
        patient_id: user.id,
        doctor_id: selectedDoctorDetails.id,
        doctor_name: selectedDoctorDetails.name,
        speciality: selectedDoctorDetails.speciality,
        date: formattedDate,
        time: selectedTime,
        status: 'scheduled',
        notes: reason || null
      });

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
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: "There was a problem booking your appointment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Appointment</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Speciality Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Speciality</label>
          <Select value={selectedSpeciality} onValueChange={setSelectedSpeciality}>
            <SelectTrigger>
              <SelectValue placeholder="Select a speciality" />
            </SelectTrigger>
            <SelectContent>
              {specialities.map((speciality) => (
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
            <SelectTrigger>
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
                className="w-full justify-start text-left font-normal"
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
            <SelectTrigger>
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
          />
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full bg-hospital-primary hover:bg-hospital-secondary"
          onClick={handleBookAppointment}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppointmentForm;
