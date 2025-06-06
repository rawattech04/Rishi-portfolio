export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { isAdmin } from '@/middleware/auth';
import connectDB from '@/lib/dbConnect';
import Project from '@/models/Project';
import type { NextRequest } from 'next/server';

// Error handler function
const handleError = (error: any) => {
  console.error('API Error:', error);

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
};

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    await isAdmin(request);
    
    // Connect to database
    await connectDB();
    
    // Get total projects
    const total = await Project.countDocuments();
    
    // Get total views (sum of all project views)
    const viewsAggregation = await Project.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ]);
    
    const views = viewsAggregation[0]?.totalViews || 0;
    
    return NextResponse.json({ total, views });
  } catch (error) {
    console.error('Project stats error:', error);
    return handleError(error);
  }
} 