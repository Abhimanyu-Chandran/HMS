
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { medicines } from '@/data/mockData';
import { ShoppingCart, Search, Filter, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Medicines = () => {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedMedicine, setExpandedMedicine] = useState<string | null>(null);
  
  // Get unique categories
  const categories = ['all', ...new Set(medicines.map(medicine => medicine.category))];
  
  // Filter medicines based on search term and category
  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || medicine.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleMedicineClick = (medicineId: string) => {
    if (expandedMedicine === medicineId) {
      setExpandedMedicine(null);
    } else {
      setExpandedMedicine(medicineId);
    }
  };

  // Custom medicine images
  const medicineImages = {
    "Pain Relief": "https://img.freepik.com/free-photo/pills-blue-background-close-up_23-2148551423.jpg",
    "Antibiotics": "https://img.freepik.com/free-photo/pills-blue-background-close-up_23-2148551414.jpg",
    "Antiviral": "https://img.freepik.com/free-photo/antibiotics-pharmacy_1339-2254.jpg",
    "Anti-inflammatory": "https://img.freepik.com/free-photo/close-up-view-drug-pills_23-2150380678.jpg",
    "Cardiac": "https://img.freepik.com/free-photo/red-white-pills-heart-shape_1150-18330.jpg",
    "default": "https://img.freepik.com/free-photo/pharmacist-s-hand-taking-medicine-box-from-shelf-drug-store_1150-26522.jpg"
  };
  
  const getMedicineImage = (category: string) => {
    // @ts-ignore
    return medicineImages[category] || medicineImages.default;
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

  return (
    <Layout>
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="page-title">Medicines</h1>
        <p className="text-muted-foreground">
          Browse and purchase medications and medical supplies.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-gray-500" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Medicine Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredMedicines.length > 0 ? (
          filteredMedicines.map((medicine) => (
            <motion.div key={medicine.id} variants={item}>
              <Card className="flex flex-col h-full hover:shadow-lg transition-all">
                <div 
                  className="h-48 w-full bg-cover bg-center" 
                  style={{ backgroundImage: `url(${getMedicineImage(medicine.category)})` }} 
                />
                <CardContent className="p-4 flex-grow">
                  <Badge className="mb-2 bg-hospital-primary">{medicine.category}</Badge>
                  <h3 className="text-lg font-semibold mb-1">{medicine.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{medicine.description}</p>
                  
                  <button
                    onClick={() => handleMedicineClick(medicine.id)}
                    className="text-hospital-primary text-sm flex items-center hover:underline mb-4"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    {expandedMedicine === medicine.id ? 'Show less' : 'More details'}
                  </button>
                  
                  {expandedMedicine === medicine.id && (
                    <motion.div 
                      className="text-sm space-y-2 border-t border-muted pt-3 mb-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <div>
                        <span className="font-medium">Dosage:</span> {medicine.category === "Pain Relief" ? "1-2 tablets every 4-6 hours" : 
                                     medicine.category === "Antibiotics" ? "1 tablet every 12 hours" :
                                     medicine.category === "Antiviral" ? "1 tablet daily" : 
                                     "As directed by physician"}
                      </div>
                      <div>
                        <span className="font-medium">Side Effects:</span> {medicine.category === "Pain Relief" ? "Drowsiness, upset stomach" : 
                                     medicine.category === "Antibiotics" ? "Diarrhea, nausea" :
                                     medicine.category === "Cardiac" ? "Dizziness, headache" : 
                                     "See package insert"}
                      </div>
                      <div>
                        <span className="font-medium">Storage:</span> Store at room temperature away from moisture and heat.
                      </div>
                    </motion.div>
                  )}
                  
                  <p className="text-lg font-bold text-hospital-primary">${medicine.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full bg-gradient-to-r from-hospital-primary to-hospital-secondary hover:opacity-90"
                    onClick={() => {
                      addToCart(medicine);
                      const toast = document.querySelector('.toast-container') as HTMLElement;
                      if (toast) {
                        toast.classList.add('active');
                        setTimeout(() => toast.classList.remove('active'), 3000);
                      }
                    }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium mb-2">No medicines found</h3>
            <p className="text-muted-foreground">
              Try changing your search term or filter.
            </p>
          </div>
        )}
      </motion.div>
      
      {/* Toast notification */}
      <div className="fixed bottom-4 right-4 bg-hospital-primary text-white p-4 rounded-md shadow-lg transform translate-y-full transition-transform duration-300 toast-container">
        Item added to cart!
      </div>
    </Layout>
  );
};

export default Medicines;
