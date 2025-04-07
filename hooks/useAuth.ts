// 'use client';

// import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
// import { useRouter } from 'next/navigation';

// interface User {
//   email: string;
//   isVerified: boolean;
// }

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   login: (email: string) => Promise<void>;
//   verifyOtp: (email: string, otp: string) => Promise<boolean>;
//   logout: () => void;
//   resendOtp: (email: string) => Promise<boolean>;
// }

// // Create auth context
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Auth provider component
// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   // Check for existing auth on mount
//   useEffect(() => {
//     // Check if user is logged in (e.g., from localStorage or cookies)
//     const checkAuth = () => {
//       const storedUser = localStorage.getItem('auth_user');
//       if (storedUser) {
//         try {
//           setUser(JSON.parse(storedUser));
//         } catch (error) {
//           console.error('Failed to parse stored user data', error);
//           localStorage.removeItem('auth_user');
//         }
//       }
//       setIsLoading(false);
//     };

//     checkAuth();
//   }, []);

//   // Login function - initiates OTP flow
//   const login = async (email: string) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Login failed');
//       }

//       // Set user with unverified status
//       setUser({ email, isVerified: false });
      
//       // Redirect to OTP verification page
//       router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Verify OTP function
//   const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/auth/verify-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Verification failed');
//       }

//       // Set verified user and store in localStorage
//       const verifiedUser = { email, isVerified: true };
//       setUser(verifiedUser);
//       localStorage.setItem('auth_user', JSON.stringify(verifiedUser));
      
//       return true;
//     } catch (error) {
//       console.error('OTP verification error:', error);
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Logout function
//   const logout = () => {
//     localStorage.removeItem('auth_user');
//     setUser(null);
//     router.push('/login');
//   };

//   // Resend OTP function
//   const resendOtp = async (email: string): Promise<boolean> => {
//     try {
//       const response = await fetch('/api/auth/resend-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to resend OTP');
//       }

//       return true;
//     } catch (error) {
//       console.error('Resend OTP error:', error);
//       return false;
//     }
//   };

//   // Create auth context value
//   const authContextValue: AuthContextType = {
//     user,
//     isLoading,
//     login,
//     verifyOtp,
//     logout,
//     resendOtp
//   };

//   return (
//     <AuthContext.Provider value={authContextValue}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // Custom hook to use auth context
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }