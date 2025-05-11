
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Calendar, Star, ShoppingCart, User, ArrowRight, Shield, Stethoscope, Syringe } from 'lucide-react';
import { specialities, doctors } from '@/data/mockData';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative -mt-8 mb-16 bg-gradient-to-br from-[#1A1F2C] to-[#242A3D] text-white py-20 px-4 rounded-xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-hero-pattern"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="bg-primary/20 text-primary px-4 py-2 rounded-full inline-block mb-4">Your Health, Our Priority</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text-primary">Quality Healthcare</span>
            <br />For Your Family
          </h1>
          <p className="text-xl mb-8 opacity-90 text-gray-300 max-w-xl">
            Experience the best healthcare services with state-of-the-art facilities and expert medical professionals.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/appointments">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Book Appointment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/specialities">
              <Button size="lg" variant="outline" className="bg-transparent border-primary text-white hover:bg-primary/10">
                Browse Specialities
              </Button>
            </Link>
          </div>
        </div>
        <div className="hidden md:block absolute bottom-0 right-0 w-1/3 h-full bg-[url('https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?q=80&w=300')] bg-cover bg-right rounded-r-xl after:absolute after:inset-0 after:bg-gradient-to-r after:from-[#1A1F2C] after:to-transparent"></div>
        
        <div className="absolute -bottom-10 right-10 hidden xl:block">
          <div className="w-32 h-32 bg-secondary/20 rounded-full filter blur-3xl"></div>
        </div>
        <div className="absolute -top-10 left-10 hidden xl:block">
          <div className="w-32 h-32 bg-primary/20 rounded-full filter blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16 relative">
        <div className="absolute inset-0 opacity-5 bg-hero-pattern"></div>
        <h2 className="section-title text-center mb-12 gradient-text-primary text-3xl font-bold">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 relative z-10">
          <Card className="feature-card bg-muted/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="icon-bg text-primary">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Appointments</h3>
              <p className="text-center text-muted-foreground mb-6">
                Schedule appointments with our expert doctors at your convenience.
              </p>
              <Link to="/appointments" className="mt-auto">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Book Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="feature-card bg-muted/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="icon-bg text-secondary">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Specialities</h3>
              <p className="text-center text-muted-foreground mb-6">
                Explore our wide range of medical specialities for all your healthcare needs.
              </p>
              <Link to="/specialities" className="mt-auto">
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="feature-card bg-muted/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="icon-bg text-accent">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Medicines</h3>
              <p className="text-center text-muted-foreground mb-6">
                Order prescribed medications and medical supplies online.
              </p>
              <Link to="/medicines" className="mt-auto">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="feature-card bg-muted/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="icon-bg text-primary">
                <User className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Patient Portal</h3>
              <p className="text-center text-muted-foreground mb-6">
                Access your medical records and manage your healthcare journey.
              </p>
              {user ? (
                <Link to="/patient" className="mt-auto">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    My Profile <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link to="/login" className="mt-auto">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Specialities */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title gradient-text-accent text-3xl font-bold">Featured Specialities</h2>
          <Link to="/specialities">
            <Button variant="link" className="text-secondary">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialities.slice(0, 3).map(speciality => (
            <Card key={speciality.id} className="overflow-hidden feature-card border-muted/50">
              <div className="h-48 w-full bg-cover bg-center relative" style={{
                backgroundImage: `url(${speciality.image})`
              }}>
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
              </div>
              <CardContent className="p-6 relative">
                <h3 className="text-xl font-semibold mb-2">{speciality.name}</h3>
                <p className="text-muted-foreground mb-4">{speciality.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Stethoscope className="h-4 w-4 mr-1" />
                    {speciality.doctorCount} Doctors
                  </span>
                  <Link to={`/specialities/${speciality.id}`}>
                    <Button variant="ghost" className="text-secondary hover:text-secondary hover:bg-secondary/10">
                      Learn More <ArrowRight className="ml-1 h-4 w-4" />
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
          <h2 className="section-title gradient-text-primary text-3xl font-bold">Our Top Doctors</h2>
          <Button variant="link" className="text-primary">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {doctors.slice(0, 4).map(doctor => (
            <Card key={doctor.id} className="feature-card bg-muted/80 backdrop-blur-sm text-center">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary/30">
                  <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{doctor.name}</h3>
                <p className="text-secondary mb-2">{doctor.speciality}</p>
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(doctor.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}`} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">({doctor.rating})</span>
                </div>
                <Link to="/appointments" className="mt-auto w-full">
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90">Book Appointment</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-16">
        <h2 className="section-title text-center mb-12 gradient-text-accent text-3xl font-bold">What Our Patients Say</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="feature-card bg-muted/80 backdrop-blur-sm">
            <CardContent className="p-6 flex flex-col">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />)}
              </div>
              <p className="mb-6 italic text-muted-foreground">
                "The care and attention I received at HealthCare was exceptional. The doctors were knowledgeable and took the time to explain everything."
              </p>
              <div className="mt-auto flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-semibold text-primary">JD</span>
                </div>
                <div>
                  <p className="font-semibold">John Doe</p>
                  <p className="text-sm text-muted-foreground">Patient</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="feature-card bg-muted/80 backdrop-blur-sm">
            <CardContent className="p-6 flex flex-col">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />)}
              </div>
              <p className="mb-6 italic text-muted-foreground">
                "I had a great experience with the online medicine ordering service. It was convenient and the delivery was prompt."
              </p>
              <div className="mt-auto flex items-center">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
                  <span className="font-semibold text-secondary">SM</span>
                </div>
                <div>
                  <p className="font-semibold">Sarah Miller</p>
                  <p className="text-sm text-muted-foreground">Patient</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="feature-card bg-muted/80 backdrop-blur-sm">
            <CardContent className="p-6 flex flex-col">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />)}
              </div>
              <p className="mb-6 italic text-muted-foreground">
                "The appointment booking process was so simple and efficient. I appreciate how easy it was to find a specialist for my needs."
              </p>
              <div className="mt-auto flex items-center">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                  <span className="font-semibold text-accent">RJ</span>
                </div>
                <div>
                  <p className="font-semibold">Robert Johnson</p>
                  <p className="text-sm text-muted-foreground">Patient</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-xl p-10 text-center mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-90"></div>
        <div className="absolute inset-0 bg-hero-pattern mix-blend-overlay"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to prioritize your health?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Schedule an appointment today and take the first step towards better health and well-being.
          </p>
          <Link to="/appointments">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Book an Appointment <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent"></div>
        
        <div className="absolute -bottom-10 right-10">
          <div className="w-40 h-40 bg-accent/30 rounded-full filter blur-3xl"></div>
        </div>
        <div className="absolute -top-10 left-10">
          <div className="w-40 h-40 bg-primary/30 rounded-full filter blur-3xl"></div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
