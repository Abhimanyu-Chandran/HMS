
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
import { ShoppingCart, Search, Filter } from 'lucide-react';

const Medicines = () => {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Get unique categories
  const categories = ['all', ...new Set(medicines.map(medicine => medicine.category))];
  
  // Filter medicines based on search term and category
  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || medicine.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="page-title">Medicines</h1>
        <p className="text-muted-foreground">
          Browse and purchase medications and medical supplies.
        </p>
      </div>

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMedicines.length > 0 ? (
          filteredMedicines.map((medicine) => (
            <Card key={medicine.id} className="flex flex-col h-full">
              <div className="h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${medicine.image})` }} />
              <CardContent className="p-4 flex-grow">
                <Badge className="mb-2">{medicine.category}</Badge>
                <h3 className="text-lg font-semibold mb-1">{medicine.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{medicine.description}</p>
                <p className="text-lg font-bold text-hospital-primary">${medicine.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full"
                  onClick={() => addToCart(medicine)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium mb-2">No medicines found</h3>
            <p className="text-muted-foreground">
              Try changing your search term or filter.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Medicines;
