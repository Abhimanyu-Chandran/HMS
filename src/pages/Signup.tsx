import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
// import { useToast } from "@/components/ui/use-toast"; // Similar to Login.tsx

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  // const { toast } = useToast(); // Keep if page-specific toasts needed
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all required fields.");
      return;
    }
    
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await signup(name, email, password, age ? Number(age) : undefined);
      // Consider navigating to a "please verify email" page or directly to login/home
      navigate('/'); 
    } catch (error) {
      // Error toast handled in AuthContext's signup function
      // console.error("Signup page error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hospital-soft-violet to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="form-container">
        <div className="text-center">
          <div className="mx-auto bg-hospital-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h2>
          <p className="text-gray-600 mb-6">Join HealthCare today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              type="text" 
              placeholder="Enter your full name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age (Optional)</Label>
            <Input 
              id="age" 
              type="number" 
              placeholder="Enter your age" 
              value={age} 
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Create a password (min. 6 characters)" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="Confirm your password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-hospital-primary hover:bg-hospital-secondary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-hospital-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
