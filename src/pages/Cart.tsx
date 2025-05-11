
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/components/ui/use-toast";
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useCart } from '@/contexts/CartContext';
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { toast } = useToast();
  
  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
      });
      return;
    }
    
    toast({
      title: "Order Placed",
      description: "Your order has been successfully placed. Thank you for shopping with us!",
    });
    
    clearCart();
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mb-6">
          <h1 className="page-title">Shopping Cart</h1>
          <p className="text-muted-foreground">
            Review and checkout your selected medicines.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({totalItems})</CardTitle>
              </CardHeader>
              
              {items.length > 0 ? (
                <CardContent>
                  <ul className="space-y-6">
                    {items.map((item) => (
                      <li key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-20 h-20 bg-cover bg-center rounded-md" style={{ backgroundImage: `url(${item.image})` }} />
                        
                        <div className="flex-grow">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-500 mb-1">{item.description}</p>
                          <p className="font-bold text-hospital-primary">${item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 h-8 text-center"
                          />
                          
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              ) : (
                <CardContent className="py-12 text-center">
                  <div className="flex justify-center mb-4">
                    <ShoppingCart className="h-12 w-12 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground mb-6">
                    Looks like you haven't added any medicines to your cart yet.
                  </p>
                  <Button asChild>
                    <a href="/medicines">Browse Medicines</a>
                  </Button>
                </CardContent>
              )}
              
              {items.length > 0 && (
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                  <Button asChild>
                    <a href="/medicines">Add More Items</a>
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{totalPrice > 50 ? 'Free' : '$4.99'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(totalPrice * 0.08).toFixed(2)}</span>
                  </div>

                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${(
                      totalPrice + 
                      (totalPrice > 50 ? 0 : 4.99) + 
                      (totalPrice * 0.08)
                    ).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                >
                  Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Cart;
