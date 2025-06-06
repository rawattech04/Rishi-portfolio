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
    content: z.string().min(1, 'Section content is required')
  })).optional(),
  isPublished: z.boolean().optional().default(false),
  publishedAt: z.union([z.string(), z.date()]).optional(),
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

// Get all published blogs with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    
    const query: any = { isPublished: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.categories = category;
    }
    
    const skip = (page - 1) * limit;
    
    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title summary image slug author publishedAt readingTime categories tags'),
      Blog.countDocuments(query)
    ]);
    
    return NextResponse.json({
      blogs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Create a new blog
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    await isAdmin(request);
    
    const body = await request.json();
    const validatedData = blogSchema.parse(body);
    
    await connectDB();
    
    // Generate base slug from title
    let baseSlug = validatedData.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug exists and generate a unique one if needed
    let slug = baseSlug;
    let counter = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Set publishedAt if isPublished is true
    if (validatedData.isPublished && !validatedData.publishedAt) {
      validatedData.publishedAt = new Date();
    }

    // Create new blog
    const blog = new Blog({ ...validatedData, slug });
    await blog.save();

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return handleError(error);
  }
}

// Update a blog
export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    await isAdmin(request);
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = blogSchema.parse(body);
    
    await connectDB();
    
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
      if (!existingBlog?.publishedAt) {
        validatedData.publishedAt = new Date();
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

// Delete a blog
export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    await isAdmin(request);
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
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