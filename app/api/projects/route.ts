import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Project from '@/models/Project';
import { z } from 'zod';
import { isAdmin } from '@/middleware/auth';

// Schema for project validation
const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
  image: z.string().url('Invalid image URL'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  category: z.string().min(1, 'Category is required'),
  githubUrl: z.string().url('Invalid GitHub URL').optional(),
  liveUrl: z.string().url('Invalid live URL').optional(),
  featured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

// Error handler function
const handleError = (error: any) => {
  console.error('API Error:', error);

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Validation error', details: error.errors },
      { status: 400 }
    );
  }

  if (error.code === 11000) {
    return NextResponse.json(
      { error: 'Project with this title already exists' },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
};

// GET all projects
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const projects = await Project.find()
      .sort('-createdAt')
      .lean();

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({
      error: 'Failed to fetch projects'
    }, { status: 500 });
  }
}

// POST new project
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    await isAdmin(request);
    
    const body = await request.json();
    const validatedData = projectSchema.parse(body);
    
    await connectDB();
    
    // Create new project
    const project = new Project(validatedData);
    await project.save();

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return handleError(error);
  }
}

// PUT update project
export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    await isAdmin(request);
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = projectSchema.parse(body);
    
    await connectDB();
    
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return handleError(error);
  }
}

// DELETE project
export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    await isAdmin(request);
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const project = await Project.findByIdAndDelete(id).lean();

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return handleError(error);
  }
} 