// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const POST = async () => {
  const cookieStore = cookies();
  cookieStore.delete('auth_session'); // Delete the session cookie
  return NextResponse.json({ message: 'Logged out successfully' });
};