import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import { specialities, doctors } from '@/data/mockData';
import { Star, Search } from 'lucide-react';
const Specialities = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter specialities based on search term
  const filteredSpecialities = specialities.filter(speciality => speciality.name.toLowerCase().includes(searchTerm.toLowerCase()) || speciality.description.toLowerCase().includes(searchTerm.toLowerCase()));
  return <Layout>
      <div className="mb-6">
        <h1 className="page-title">Medical Specialities</h1>
        <p className="text-muted-foreground">
          Explore our comprehensive range of medical specialities.
        </p>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-1/2 mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input placeholder="Search specialities..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
      </div>

      {/* Speciality Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSpecialities.length > 0 ? filteredSpecialities.map(speciality => <Card key={speciality.id} className="overflow-hidden hover:shadow-lg transition-all">
              <div style={{
          backgroundImage: `url(${speciality.image})`
        }} className="h-48 w-full bg-cover bg-center" />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{speciality.name}</h3>
                <p className="text-gray-600 mb-4">{speciality.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <span className="text-hospital-primary font-medium">{speciality.doctorCount}</span>
                    <span className="ml-1 text-gray-500">Doctors</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Top Doctors:</h4>
                  <div className="space-y-2">
                    {doctors.filter(doctor => doctor.speciality === speciality.name).slice(0, 2).map(doctor => <div key={doctor.id} className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium">{doctor.name}</p>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs text-gray-500 ml-1">{doctor.rating}</span>
                            </div>
                          </div>
                        </div>)}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Link to="/appointments">
                    <Button>Book Appointment</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>) : <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium mb-2">No specialities found</h3>
            <p className="text-muted-foreground">
              Try changing your search term.
            </p>
          </div>}
      </div>
    </Layout>;
};
export default Specialities;