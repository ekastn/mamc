
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { TokenPayload, verifyToken } from '@/lib/api/auth-middleware';

export async function getAuthenticationStatus(): Promise<boolean> {
  try {
    console.log('[Auth] Getting cookies...');
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    console.log('[Auth] Token exists in cookies:', !!token);

    if (!token) {
      console.log('[Auth] No auth token found');
      return false;
    }

    console.log('[Auth] Verifying token...');
    const payload = await verifyToken(token);
    console.log('[Auth] Token verified, payload:', payload ? 'exists' : 'missing');

    if (!payload || !payload.userId) {
      console.log('[Auth] Invalid token payload:', { hasPayload: !!payload, hasUserId: payload?.userId });
      return false;
    }

    console.log('[Auth] Looking up user with ID:', payload.userId);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    console.log('[Auth] User lookup result:', user ? 'found' : 'not found');

    if (!user) {
      console.log('[Auth] User not found in database');
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Auth] Authentication error:', error);
    return false;
  }
}
