import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Blog from '@/models/Blog';
import { isAdmin } from '@/middleware/auth';
import { z } from 'zod';

// Schema for blog validation
const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  summary: z.string().min(1, 'Summary is required').max(500, 'Summary is too long'),
  image: z.string().url('Invalid image URL'),
  author: z.string().min(1, 'Author is required'),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  sections: z.array(z.object({
    title: z.string().min(1, 'Section title is required'),
    content: z.string().min(1, 'Section content is required'),
    image: z.string().optional()
  })).optional(),
  isPublished: z.boolean().optional().default(false),
  publishedAt: z.string().optional(),
  views: z.number().optional().default(0),
  slug: z.string().optional()
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
      { error: 'Blog with this title already exists' },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
};

// Get a single blog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    await isAdmin(request);

    await connectDB();
    const { id } = params;

    const blog = await Blog.findById(id).lean();

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return handleError(error);
  }
}

// Update a single blog by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    await isAdmin(request);

    await connectDB();
    const { id } = params;
    const body = await request.json();
    const validatedData = blogSchema.parse(body);

    // If title is being updated, update slug
    if (validatedData.title) {
      let baseSlug = validatedData.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // Check if slug exists and generate a unique one if needed
      let slug = baseSlug;
      let counter = 1;
      while (await Blog.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      validatedData.slug = slug;
    }

    // Set publishedAt if isPublished is being set to true
    if (validatedData.isPublished) {
      const existingBlog = await Blog.findById(id);
      if (!existingBlog.publishedAt) {
        validatedData.publishedAt = new Date().toISOString();
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return handleError(error);
  }
}

// Delete a single blog by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    await isAdmin(request);

    await connectDB();
    const { id } = params;

    const blog = await Blog.findByIdAndDelete(id).lean();

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return handleError(error);
  }
} 