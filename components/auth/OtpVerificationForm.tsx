'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OtpVerificationForm() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  const router = useRouter();
  
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-center">Verify Your Email</h2>
      <p className="text-center text-gray-600 mb-6">
        We've sent a 6-digit code to {email}
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {resendSuccess && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          New code sent! Check your email.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
            Verification Code
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest text-gray-700"
            placeholder="000000"
            maxLength={6}
            required
          />
        </div>
        
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600">
            Code expires in <span className="font-bold">{formatTime(countdown)}</span>
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 mb-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Verifying...' : 'Verify & Login'}
        </button>
        
        <div className="text-center">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendLoading || countdown > 0}
            className={`text-blue-600 hover:text-blue-800 text-sm font-medium ${
              (resendLoading || countdown > 0) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {resendLoading ? 'Sending...' : countdown > 0 ? `Resend code in ${formatTime(countdown)}` : 'Resend code'}
          </button>
        </div>
      </form>
    </div>
  );
}