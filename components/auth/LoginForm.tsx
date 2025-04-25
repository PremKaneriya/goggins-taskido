'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  
  // Animation setup
  useEffect(() => {
    // Animate the form elements
    gsap.fromTo(
      ".form-element",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      }
    );
    
    // Animate the quote
    gsap.fromTo(
      ".quote-text",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.5,
        delay: 1,
        ease: "power2.out",
      }
    );
  }, []);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      setSuccess(true);
      
      // Redirect to OTP verification page
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex items-center py-12">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row">
        {/* Left side - Form */}
        <div className="lg:w-1/2 lg:pr-8">
          <div className="form-element">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Start Your Journey</h1>
            <p className="text-gray-400 mb-8">Mental toughness starts here. No shortcuts.</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 sm:p-8 shadow-lg border border-gray-800 form-element">
            {error && (
              <div className="mb-6 p-3 bg-red-900/40 border border-red-800 text-red-200 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-3 bg-green-900/40 border border-green-800 text-green-200 rounded-md text-sm">
                Check your email for the login code!
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-element">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="name@example.com"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`form-element w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 font-medium transition duration-200 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Sending...' : 'Send Login Code'}
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm form-element">
              No excuses. Stay hard.
            </div>
          </div>
        </div>
        
        {/* Right side - Image & Quote */}
        <div className="lg:w-1/2 mt-10 lg:mt-0 relative flex flex-col items-center justify-center">
          <div className="relative max-w-md form-element">
            <img
              src="https://64.media.tumblr.com/5400f00ebc186b7643c74ebab2209541/tumblr_n3oxh4yPrH1qel8cho1_1280.pnj"
              alt="David Goggins"
              className="w-full"
            />
          </div>
          <div className="mt-6 text-center max-w-sm quote-text">
            <blockquote className="text-xl italic text-gray-300">
              "You are in danger of living a life so comfortable and soft that you will die without ever realizing your true potential."
            </blockquote>
            <p className="mt-2 text-blue-400 font-semibold">- David Goggins</p>
          </div>
        </div>
      </div>
    </div>
  );
}