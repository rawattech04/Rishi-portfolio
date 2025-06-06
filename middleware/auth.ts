import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface TokenPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

export async function authenticateToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized - No token provided');
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // Check token expiration
    const now = Math.floor(Date.now() / 1000);
    if ((decoded as any).exp && (decoded as any).exp < now) {
      throw new Error('Unauthorized - Token expired');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Unauthorized - Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Unauthorized - Invalid token');
    }
    throw error;
  }
}

export async function isAdmin(request: NextRequest) {
  try {
    const decoded = await authenticateToken(request);
    if (!decoded || !decoded.isAdmin) {
      throw new Error('Unauthorized - Admin access required');
    }
    return decoded;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unauthorized - Invalid token');
  }
} 