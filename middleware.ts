import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of allowed origins
const allowedOrigins = [
  'http://localhost:3000', 
  'https://rishi-portfolio-busa-git-main-rishi-rawats-projects.vercel.app', 
  'https://rishi-portfolio-busa.vercel.app',
  'https://rishi-portfolio.vercel.app', 
];

export function middleware(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin') || '';
  
  // Only handle API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Check if the origin is allowed
    const isAllowedOrigin = allowedOrigins.includes(origin) || !origin;
    
    // Create response headers with CORS settings
    const headers = {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
      // Add additional headers that might be needed
      'Access-Control-Max-Age': '86400', // 24 hours in seconds
    };

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return NextResponse.json({}, { headers });
    }

    // Handle the actual request
    const response = NextResponse.next();
    
    // Add CORS headers to the response
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  return NextResponse.next();
}

// Configure the middleware to only run on API routes
export const config = {
  matcher: '/api/:path*',
}; 