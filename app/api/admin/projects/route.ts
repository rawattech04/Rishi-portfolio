import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Project from '@/models/Project';
import { isAdmin } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await isAdmin(request);
    
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    await isAdmin(request);
    
    const data = await request.json();
    
    await connectDB();
    
    // Create new project
    const project = await Project.create(data);
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 