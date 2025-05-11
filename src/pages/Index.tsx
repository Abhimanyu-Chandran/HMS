
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Calendar, Star, ShoppingCart, User } from 'lucide-react';
import { specialities, doctors } from '@/data/mockData';

const Index = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative -mt-8 mb-16 bg-gradient-to-br from-hospital-primary to-hospital-secondary text-white py-20 px-4 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Health, Our Priority
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Experience the best healthcare services with state-of-the-art facilities and expert medical professionals.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/appointments">
              <Button size="lg" className="bg-white text-hospital-primary hover:bg-hospital-soft-blue">
                Book Appointment
              </Button>
            </Link>
            <Link to="/specialities">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                Browse Specialities
              </Button>
            </Link>
          </div>
        </div>
        <div className="hidden md:block absolute bottom-0 right-0 w-1/3 h-full bg-[url('https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?q=80&w=300')] bg-cover bg-right rounded-r-xl" />
      </section>

      {/* Services Section */}
      <section className="mb-16">
        <h2 className="section-title text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <Card className="hover:shadow-md transition-all">
            <CardContent className="flex flex-col items-center p-6">
              <div className="w-16 h-16 flex items-center justify-center bg-hospital-soft-blue rounded-full mb-4">
                <Calendar className="h-8 w-8 text-hospital-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Appointments</h3>
              <p className="text-center text-gray-600 mb-4">
                Schedule appointments with our expert doctors at your convenience.
              </p>
              <Link to="/appointments">
                <Button variant="outline">Book Now</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardContent className="flex flex-col items-center p-6">
              <div className="w-16 h-16 flex items-center justify-center bg-hospital-soft-blue rounded-full mb-4">
                <Star className="h-8 w-8 text-hospital-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Specialities</h3>
              <p className="text-center text-gray-600 mb-4">
                Explore our wide range of medical specialities for all your healthcare needs.
              </p>
              <Link to="/specialities">
                <Button variant="outline">Explore</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardContent className="flex flex-col items-center p-6">
              <div className="w-16 h-16 flex items-center justify-center bg-hospital-soft-blue rounded-full mb-4">
                <ShoppingCart className="h-8 w-8 text-hospital-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Medicines</h3>
              <p className="text-center text-gray-600 mb-4">
                Order prescribed medications and medical supplies online.
              </p>
              <Link to="/medicines">
                <Button variant="outline">Shop Now</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardContent className="flex flex-col items-center p-6">
              <div className="w-16 h-16 flex items-center justify-center bg-hospital-soft-blue rounded-full mb-4">
                <User className="h-8 w-8 text-hospital-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Patient Portal</h3>
              <p className="text-center text-gray-600 mb-4">
                Access your medical records and manage your healthcare journey.
              </p>
              {user ? (
                <Button variant="outline">My Profile</Button>
              ) : (
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Specialities */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title">Featured Specialities</h2>
          <Link to="/specialities">
            <Button variant="link" className="text-hospital-primary">
              View All
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialities.slice(0, 3).map((speciality) => (
            <Card key={speciality.id} className="overflow-hidden hover:shadow-md transition-all">
              <div className="h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${speciality.image})` }} />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{speciality.name}</h3>
                <p className="text-gray-600 mb-4">{speciality.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{speciality.doctorCount} Doctors</span>
                  <Link to={`/specialities/${speciality.id}`}>
                    <Button variant="ghost" className="text-hospital-primary hover:text-hospital-secondary">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Top Doctors */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title">Our Top Doctors</h2>
          <Button variant="link" className="text-hospital-primary">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {doctors.slice(0, 4).map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-md transition-all">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1">{doctor.name}</h3>
                <p className="text-hospital-primary mb-2">{doctor.speciality}</p>
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(doctor.rating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">({doctor.rating})</span>
                </div>
                <Link to="/appointments">
                  <Button size="sm">Book Appointment</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-16">
        <h2 className="section-title text-center">What Our Patients Say</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
              <p className="mb-4 italic text-gray-600">
                "The care and attention I received at HealthCare was exceptional. The doctors were knowledgeable and took the time to explain everything."
              </p>
              <div className="mt-auto flex items-center">
                <div className="w-10 h-10 rounded-full bg-hospital-soft-blue flex items-center justify-center mr-3">
                  <span className="font-semibold text-hospital-primary">JD</span>
                </div>
                <div>
                  <p className="font-semibold">John Doe</p>
                  <p className="text-sm text-gray-500">Patient</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
              <p className="mb-4 italic text-gray-600">
                "I had a great experience with the online medicine ordering service. It was convenient and the delivery was prompt."
              </p>
              <div className="mt-auto flex items-center">
                <div className="w-10 h-10 rounded-full bg-hospital-soft-blue flex items-center justify-center mr-3">
                  <span className="font-semibold text-hospital-primary">SM</span>
                </div>
                <div>
                  <p className="font-semibold">Sarah Miller</p>
                  <p className="text-sm text-gray-500">Patient</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
              <p className="mb-4 italic text-gray-600">
                "The appointment booking process was so simple and efficient. I appreciate how easy it was to find a specialist for my needs."
              </p>
              <div className="mt-auto flex items-center">
                <div className="w-10 h-10 rounded-full bg-hospital-soft-blue flex items-center justify-center mr-3">
                  <span className="font-semibold text-hospital-primary">RJ</span>
                </div>
                <div>
                  <p className="font-semibold">Robert Johnson</p>
                  <p className="text-sm text-gray-500">Patient</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-hospital-primary text-white rounded-xl p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to prioritize your health?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Schedule an appointment today and take the first step towards better health and well-being.
        </p>
        <Link to="/appointments">
          <Button size="lg" className="bg-white text-hospital-primary hover:bg-hospital-soft-blue">
            Book an Appointment
          </Button>
        </Link>
      </section>
    </Layout>
  );
};

export default Index;
