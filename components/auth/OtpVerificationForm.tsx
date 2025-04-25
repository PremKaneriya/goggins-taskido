'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

export default function OtpVerificationForm() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  
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
  
  useEffect(() => {
    // Alternative to useSearchParams - get email from URL directly
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get('email') || '';
      
      if (emailParam) {
        setEmail(emailParam);
      } else {
        // Redirect back to login if no email provided
        router.replace('/login');
      }
    }
    
    // Set up countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [router]);
  
  // Format countdown time as MM:SS
  const formatTime = (time: any) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!otp || otp.length < 6) {
      setError('Please enter the 6-digit code');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }
      
      // Redirect to dashboard or home page after successful login
      router.push('/tasks');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      setError(null);
      setResendSuccess(false);
      
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }
      
      setResendSuccess(true);
      setCountdown(300); // Reset the countdown timer
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setResendLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex items-center py-12">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row">
        {/* Left side - Form */}
        <div className="lg:w-1/2 lg:pr-8">
          <div className="form-element">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Verify Your Code</h1>
            <p className="text-gray-400 mb-8">One step closer to greatness. No retreat.</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 sm:p-8 shadow-lg border border-white form-element">
            {error && (
              <div className="mb-6 p-3 bg-red-900/40 border border-red-800 text-red-200 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {resendSuccess && (
              <div className="mb-6 p-3 bg-green-900/40 border border-green-800 text-green-200 rounded-md text-sm">
                New code sent! Check your email.
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-element">
                <p className="text-gray-400 mb-4">
                  We've sent a 6-digit code to <span className="text-blue-400">{email}</span>
                </p>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
                  className="w-full bg-gray-800 text-white px-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              
              <div className="form-element text-center">
                <p className="text-sm text-gray-400">
                  Code expires in <span className="font-bold text-blue-400">{formatTime(countdown)}</span>
                </p>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`form-element w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 font-medium transition duration-200 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-800 text-center form-element">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading || countdown > 0}
                className={`text-blue-400 hover:text-blue-300 text-sm font-medium ${
                  (resendLoading || countdown > 0) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {resendLoading ? 'Sending...' : countdown > 0 ? `Resend code in ${formatTime(countdown)}` : 'Resend code'}
              </button>
              <div className="mt-4 text-gray-500 text-sm">
                The hard path is the only path.
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Image & Quote */}
        <div className="lg:w-1/2 mt-10 lg:mt-0 relative flex flex-col items-center justify-center">
          <div className="relative max-w-md form-element">
            <img
              src="https://www.gogginsnoexcuses.com/img/theRock_cut.png"
              alt="Motivational Figure"
              className="w-full"
            />
          </div>
          <div className="mt-6 text-center max-w-sm quote-text">
            <blockquote className="text-xl italic text-gray-300">
              "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success. Greatness will come."
            </blockquote>
            <p className="mt-2 text-blue-400 font-semibold">- Dwayne "The Rock" Johnson</p>
          </div>
        </div>
      </div>
    </div>
  );
}