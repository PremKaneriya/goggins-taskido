
import { query } from '@/lib/db/database';
import { User } from '@/lib/db/users';
import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { JwtPayload, verify } from 'jsonwebtoken';

const SESSION_COOKIE_NAME = 'auth_session';
const SESSION_EXPIRY_DAYS = 7;

// Create a new session for a user
export async function createSession(user: User): Promise<string> {
  // Generate a random session token
  const sessionToken = randomBytes(32).toString('hex');
  
  // Calculate expiry date (7 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);
  
  // Store the session in the database
  await query(
    `INSERT INTO user_sessions (user_id, session_token, expires_at)
     VALUES ($1, $2, $3)`,
    [user.id, sessionToken, expiresAt]
  );
  
  return sessionToken;
}

// Get user from session token
export async function getUserFromSession(sessionToken: string): Promise<User | null> {
  if (!sessionToken) return null;
  
  const result = await query<{ user_id: number }>(
    `SELECT user_id FROM user_sessions 
     WHERE session_token = $1 AND expires_at > NOW()`,
    [sessionToken]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const userId = result.rows[0].user_id;
  
  // Get the user
  const userResult = await query<User>(
    'SELECT * FROM users WHERE id = $1 AND is_deleted = false',
    [userId]
  );
  
  return userResult.rows[0] || null;
}

// Set session cookie
export function setSessionCookie(sessionToken: string): void {
  const cookieStore = cookies();
  
  // Calculate expiry date for the cookie
  const expiresDate = new Date();
  expiresDate.setDate(expiresDate.getDate() + SESSION_EXPIRY_DAYS);
  
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: sessionToken,
    expires: expiresDate,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
}

// Get session token from request
export function getSessionToken(request: NextRequest): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim().split('='));
  const sessionCookie = cookies.find(([name]) => name === SESSION_COOKIE_NAME);
  
  return sessionCookie ? sessionCookie[1] : null;
}

// Delete a user session
export async function deleteSession(sessionToken: string): Promise<void> {
  await query(
    'DELETE FROM user_sessions WHERE session_token = $1',
    [sessionToken]
  );
  
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getUserFromRequest(req: NextRequest) {
  try {
    // Get the session token from cookies
    const sessionToken = req.cookies.get('auth_session')?.value;
    
    if (!sessionToken) {
      console.log('No session token found in cookies');
      return null;
    }
    
    // Use your existing function to get the user from the session
    const user = await getUserFromSession(sessionToken);
    
    if (!user) {
      console.log('No valid user found for session token');
      return null;
    }
    
    // Return just the user ID
    return user.id;
  } catch (error) {
    console.error('Error extracting user from request:', error);
    return null;
  }
}