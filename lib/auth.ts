import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ADMIN_TOKEN = 'admin-token';

interface TokenPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  exp?: number;
}

export const createToken = (payload: TokenPayload): string => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    
    // Check token expiration
    if (decoded.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        console.error('Token expired:', {
          expiration: new Date(decoded.exp * 1000).toISOString(),
          now: new Date(now * 1000).toISOString()
        });
        return null;
      }
    }
    
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN);
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_TOKEN, token);
};

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_TOKEN);
};

export const handleLogout = (): void => {
  removeAuthToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/signin';
  }
};

export const checkAuth = (): boolean | null => {
  const token = getAuthToken();
  if (!token) {
    console.debug('No auth token found');
    return null;
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    console.error('Token verification failed, removing token');
    removeAuthToken();
    return null;
  }
  
  return decoded.isAdmin;
};

export const validateAdminCredentials = (email: string, password: string) => {
  const validEmail = process.env.ADMIN_EMAIL;
  const validPassword = process.env.ADMIN_PASSWORD;
  
  if (!validEmail || !validPassword) {
    throw new Error('Admin credentials not properly configured');
  }
  
  return email === validEmail && password === validPassword;
};

// Add a function to get auth headers
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? {
    'Authorization': `Bearer ${token}`,
    'x-admin-request': 'true',
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
}; 