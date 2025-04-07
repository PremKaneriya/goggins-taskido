import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/auth/otp';
import { updateLastLogin } from '@/lib/db/users';
import { createSession, setSessionCookie } from '@/utils/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;
    
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Verify the OTP
    const { valid, user } = await verifyOtp(email, otp);
    
    if (!valid || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }
    
    // Update the user's last login time
    await updateLastLogin(user.id);
    
    // Create a new session
    const sessionToken = await createSession(user);
    
    // Set the session cookie
    setSessionCookie(sessionToken);
    
    // Return success response
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name
      }
    });
    
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}