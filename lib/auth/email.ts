import nodemailer from 'nodemailer';

// Create a transporter with your email service credentials
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS,
  },
});

// Send OTP via email
export async function sendOtpEmail(to: string, otp: string): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Your App" <noreply@yourapp.com>',
      to,
      subject: 'Your Login Code',
      text: `Your verification code is: ${otp}\n\nThis code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Your Verification Code</h2>
          <div style="text-align: center; padding: 15px; background-color: #f9f9f9; border-radius: 4px; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${otp}</span>
          </div>
          <p style="color: #666; text-align: center;">This code will expire in 15 minutes.</p>
          <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Verify the email configuration is working
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}