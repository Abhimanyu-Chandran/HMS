
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import { specialities, doctors } from '@/data/mockData';
import { Star, Search, ChevronRight, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Specialities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSpeciality, setExpandedSpeciality] = useState<string | null>(null);
  
  // Filter specialities based on search term
  const filteredSpecialities = specialities.filter((speciality) =>
    speciality.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speciality.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSpecialityClick = (specialityId: string) => {
    if (expandedSpeciality === specialityId) {
      setExpandedSpeciality(null);
    } else {
      setExpandedSpeciality(specialityId);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Updated specialty images with high-quality, professional medical images
  const specialtyImages = {
    "Cardiology": "https://images.unsplash.com/photo-1579154341098-e4e158cc7f53?q=80&w=800&auto=format&fit=crop",
    "Neurology": "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=800&auto=format&fit=crop",
    "Orthopedics": "https://images.unsplash.com/photo-1571772805064-207c8435df79?q=80&w=800&auto=format&fit=crop",
    "Dermatology": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop",
    "Pediatrics": "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop",
    "ENT": "https://images.unsplash.com/photo-1609643242070-c69379b441b0?q=80&w=800&auto=format&fit=crop",
    "default": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop"
  };

  const getSpecialtyImage = (specialty: string) => {
    // @ts-ignore
    return specialtyImages[specialty] || specialtyImages.default;
  };

  return (
    <Layout>
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="page-title">Medical Specialities</h1>
        <p className="text-muted-foreground">
          Explore our comprehensive range of medical specialities.
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative w-full md:w-1/2 mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search specialities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 focus:ring-hospital-primary"
        />
      </div>

      {/* Speciality Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredSpecialities.length > 0 ? (
          filteredSpecialities.map((speciality) => (
            <motion.div key={speciality.id} variants={item}>
              <Card 
                className="overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                onClick={() => handleSpecialityClick(speciality.id)}
              >
                <div 
                  className="h-48 w-full bg-cover bg-center" 
                  style={{ backgroundImage: `url(${getSpecialtyImage(speciality.name)})` }}
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{speciality.name}</h3>
                  <p className="text-gray-600 mb-4">{speciality.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Users size={16} className="text-hospital-primary mr-2" />
                      <span className="text-hospital-primary font-medium">{speciality.doctorCount}</span>
                      <span className="ml-1 text-gray-500">Doctors</span>
                    </div>
                    
                    <motion.button
                      className="text-hospital-primary flex items-center"
                      whileHover={{ x: 5 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpecialityClick(speciality.id);
                      }}
                    >
                      {expandedSpeciality === speciality.id ? 'Show Less' : 'Learn More'} 
                      <ChevronRight size={16} className="ml-1" />
                    </motion.button>
                  </div>
                  
                  {expandedSpeciality === speciality.id && (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="font-medium">Top Doctors:</h4>
                      <div className="space-y-2">
                        {doctors
                          .filter((doctor) => doctor.speciality === speciality.name)
                          .slice(0, 2)
                          .map((doctor) => (
                            <div key={doctor.id} className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img 
                                  src={doctor.image} 
                                  alt={doctor.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{doctor.name}</p>
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                  <span className="text-xs text-gray-500 ml-1">{doctor.rating}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      
                      <div className="pt-4 border-t border-muted mt-4">
                        <h4 className="font-medium mb-2">Common Treatments:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {speciality.name === "Cardiology" && (
                            <>
                              <li>Cardiac Catheterization</li>
                              <li>Echocardiogram</li>
                              <li>Coronary Angioplasty</li>
                            </>
                          )}
                          {speciality.name === "Neurology" && (
                            <>
                              <li>Electroencephalogram (EEG)</li>
                              <li>Nerve Conduction Studies</li>
                              <li>Cognitive Testing</li>
                            </>
                          )}
                          {speciality.name === "Orthopedics" && (
                            <>
                              <li>Joint Replacement Surgery</li>
                              <li>Fracture Treatment</li>
                              <li>Physical Therapy</li>
                            </>
                          )}
                          {speciality.name === "Dermatology" && (
                            <>
                              <li>Skin Cancer Screening</li>
                              <li>Acne Treatment</li>
                              <li>Dermatitis Management</li>
                            </>
                          )}
                          {speciality.name === "Pediatrics" && (
                            <>
                              <li>Well-Child Visits</li>
                              <li>Immunizations</li>
                              <li>Growth and Development Assessment</li>
                            </>
                          )}
                          {speciality.name === "ENT" && (
                            <>
                              <li>Tonsillectomy</li>
                              <li>Hearing Tests</li>
                              <li>Sinus Surgery</li>
                            </>
                          )}
                          {!["Cardiology", "Neurology", "Orthopedics", "Dermatology", "Pediatrics", "ENT"].includes(speciality.name) && (
                            <>
                              <li>Consultations</li>
                              <li>Diagnostic Testing</li>
                              <li>Treatment Planning</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="mt-6 flex justify-end">
                    <Link to="/appointments">
                      <Button 
                        className="bg-gradient-to-r from-hospital-primary to-hospital-secondary hover:opacity-90"
                      >
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium mb-2">No specialities found</h3>
            <p className="text-muted-foreground">
              Try changing your search term.
            </p>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Specialities;
