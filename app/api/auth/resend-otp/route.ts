import { NextRequest, NextResponse } from 'next/server';
import { createOtp } from '@/lib/auth/otp';
import { sendOtpEmail } from '@/lib/auth/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate a new OTP
    const { otpCode } = await createOtp(email);
    
    // Send the new OTP via email
    const emailSent = await sendOtpEmail(email, otpCode);
    
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'New OTP sent successfully'
    });
    
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to resend OTP' },
      { status: 500 }
    );
  }
}