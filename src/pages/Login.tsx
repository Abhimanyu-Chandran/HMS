import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
// useToast is already imported in AuthContext, so we don't strictly need it here if errors are handled there.
// However, for specific UI feedback on this page, it can be kept.
// import { useToast } from "@/components/ui/use-toast"; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  // const { toast } = useToast(); // Keep if you want page-specific toasts
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic client-side validation, more robust validation can be added.
    if (!email || !password) {
      // This toast can be removed if AuthContext handles all error toasts.
      // toast({ 
      //   variant: "destructive",
      //   title: "Validation Error",
      //   description: "Please enter both email and password.",
      // });
      alert("Please enter both email and password."); // Simple alert for now
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      navigate('/'); // Navigate to home or dashboard after successful login
    } catch (error) {
      // Error toast is now handled in AuthContext's login function.
      // console.error("Login page error:", error); 
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600 mb-6">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-sm text-hospital-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-hospital-primary hover:bg-hospital-secondary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-hospital-primary hover:underline">
              Sign up
            </Link>
          </p>
          
          {/* Demo accounts note can be removed or updated as real auth is now in place */}
          {/* 
          <div className="mt-4 text-sm text-gray-500">
            <p>Demo accounts:</p>
            <p><strong>Admin:</strong> admin@hospital.com / admin123</p>
            <p><strong>Patient:</strong> any email / any password</p>
          </div>
          */}
        </div>
      </div>
    </div>
  );
};

export default Login;
