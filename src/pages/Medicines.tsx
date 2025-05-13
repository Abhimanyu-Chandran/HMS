
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
import { ShoppingCart, Search, Filter, Info, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMedicines, Medicine } from '@/hooks/useMedicines';
import { toast } from "@/hooks/use-toast";

const Medicines = () => {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedMedicine, setExpandedMedicine] = useState<string | null>(null);
  
  // Fetch medicines from Supabase
  const { data: medicines = [], isLoading, isError } = useMedicines();
  
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
  
  const getMedicineImage = (medicine: Medicine) => {
    return medicine.image_url || "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=800&auto=format&fit=crop";
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-hospital-primary" />
          <p className="ml-2 text-lg">Loading medicines...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-red-500 mb-2">Failed to load medicines</h3>
          <p className="text-muted-foreground mb-4">
            There was a problem fetching the medicines data. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      )}

      {/* Medicine Cards */}
      {!isLoading && !isError && (
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
                    style={{ backgroundImage: `url(${getMedicineImage(medicine)})` }} 
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
                          <span className="font-medium">Dosage:</span> {medicine.dosage || "As directed by physician"}
                        </div>
                        <div>
                          <span className="font-medium">Side Effects:</span> {medicine.side_effects || "See package insert"}
                        </div>
                        <div>
                          <span className="font-medium">Storage:</span> {medicine.storage || "Store at room temperature away from moisture and heat"}
                        </div>
                      </motion.div>
                    )}
                    
                    <p className="text-lg font-bold text-hospital-primary">${medicine.price.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      className="w-full bg-gradient-to-r from-hospital-primary to-hospital-secondary hover:opacity-90"
                      onClick={() => addToCart(medicine)}
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
      )}
    </Layout>
  );
};

export default Medicines;
