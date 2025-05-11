
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { doctors, appointments } from '@/data/mockData';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const Appointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  // Get unique specialities
  const specialities = ['all', ...new Set(doctors.map(doctor => doctor.speciality))];

  // Filter doctors based on selected speciality
  const filteredDoctors = selectedSpeciality && selectedSpeciality !== 'all'
    ? doctors.filter(doctor => doctor.speciality === selectedSpeciality)
    : doctors;

  // Define available time slots (in a real app, these would be dynamic based on doctor availability)
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  // Filter appointments for current user (in a real app, this would come from an API call)
  const userAppointments = user
    ? appointments.filter(apt => apt.patientId === user.id)
    : [];

  const handleBookAppointment = () => {
    if (!user) {
      navigate('/login');
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
    
    toast({
      title: "Appointment Booked",
      description: `Your appointment with ${selectedDoctorDetails?.name} on ${format(selectedDate, 'PPP')} at ${selectedTime} has been scheduled.`,
    });

    // Reset form
    setSelectedDoctor('');
    setSelectedSpeciality('');
    setSelectedDate(undefined);
    setSelectedTime('');
    setReason('');
  };

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
                        onValueChange={setSelectedDoctor}
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
                      className="w-full"
                      onClick={handleBookAppointment}
                    >
                      Book Appointment
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Doctor Information */}
              <div>
                {selectedDoctor ? (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Doctor Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const doctor = doctors.find(d => d.id === selectedDoctor);
                        return doctor ? (
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
                        ) : (
                          <p>Please select a doctor to view their information.</p>
                        );
                      })()}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      <p>Select a doctor to view their information.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manage">
            <div>
              <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
              
              {userAppointments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userAppointments.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{appointment.doctorName}</CardTitle>
                            <p className="text-sm text-muted-foreground">{appointment.speciality}</p>
                          </div>
                          {(() => {
                            switch (appointment.status) {
                              case 'scheduled':
                                return <Badge className="bg-blue-500">Scheduled</Badge>;
                              case 'completed':
                                return <Badge className="bg-green-500">Completed</Badge>;
                              case 'cancelled':
                                return <Badge variant="destructive">Cancelled</Badge>;
                              default:
                                return null;
                            }
                          })()}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Date:</span>
                            <span className="text-sm">{appointment.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Time:</span>
                            <span className="text-sm">{appointment.time}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        {appointment.status === 'scheduled' && (
                          <div className="flex space-x-2 w-full">
                            <Button variant="outline" className="flex-1">Reschedule</Button>
                            <Button variant="destructive" className="flex-1">Cancel</Button>
                          </div>
                        )}
                        {appointment.status === 'completed' && (
                          <Button variant="outline" className="w-full">View Details</Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <h3 className="text-xl font-medium mb-2">No appointments found</h3>
                    <p className="text-muted-foreground mb-6">
                      You don't have any appointments scheduled.
                    </p>
                    <Button onClick={navigateToBooking}>
                      Book an Appointment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Layout>
    </ProtectedRoute>
  );
};

export default Appointments;
