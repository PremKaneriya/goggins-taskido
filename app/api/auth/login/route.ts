import { NextRequest, NextResponse } from 'next/server';
import { createOtp } from '@/lib/auth/otp';
import { sendOtpEmail } from '@/lib/auth/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Generate OTP and get/create user
    const { otpCode, user } = await createOtp(email);
    
    // Send OTP via email
    const emailSent = await sendOtpEmail(email, otpCode);
    
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      );
    }
    
    // Return success response (don't include the OTP in response for security)
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      email
    });
    
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}