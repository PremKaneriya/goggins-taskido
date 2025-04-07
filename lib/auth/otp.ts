import { query } from "../db/database";
import { User, getUserByEmail, createOrUpdateUser } from "../db/users";

interface OtpCode {
  id: number;
  user_id: number;
  email: string;
  code: string;
  expires_at: Date;
  is_used: boolean;
  created_at: Date;
}

// Generate a random 6-digit OTP
function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create a new OTP for a user
export async function createOtp(email: string): Promise<{ otpCode: string; user: User }> {
  // Get or create user
  let user = await getUserByEmail(email);
  
  if (!user) {
    user = await createOrUpdateUser({ email });
  }
  
  // Generate 6-digit OTP code
  const otpCode = generateOtpCode();
  
  // Set expiration time (15 minutes from now)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);
  
  // Delete any existing OTPs for this user
  await query(
    'DELETE FROM otp_codes WHERE email = $1',
    [email]
  );
  
  // Store the new OTP
  await query(
    `INSERT INTO otp_codes (user_id, email, code, expires_at) 
     VALUES ($1, $2, $3, $4)`,
    [user.id, email, otpCode, expiresAt]
  );
  
  return { otpCode, user };
}

// Verify an OTP code
export async function verifyOtp(email: string, code: string): Promise<{ valid: boolean; user?: User }> {
  // Get the user
  const user = await getUserByEmail(email);
  
  if (!user) {
    return { valid: false };
  }
  
  // Find the OTP
  const result = await query<OtpCode>(
    `SELECT * FROM otp_codes 
     WHERE email = $1 AND code = $2 AND expires_at > NOW() AND is_used = false
     ORDER BY created_at DESC
     LIMIT 1`,
    [email, code]
  );
  
  if (result.rows.length === 0) {
    return { valid: false };
  }
  
  const otpRecord = result.rows[0];
  
  // Mark OTP as used
  await query(
    'UPDATE otp_codes SET is_used = true WHERE id = $1',
    [otpRecord.id]
  );
  
  return { valid: true, user };
}