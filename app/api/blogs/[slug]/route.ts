import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Blog from '@/models/Blog';
import { IBlog } from '@/types/blog';
import { Document, Types } from 'mongoose';

// Error handler function
const handleError = (error: any) => {
  console.error('API Error:', error);
  console.error('Error stack:', error.stack);
  console.error('Error details:', {
    name: error.name,
    message: error.message,
    code: error.code
  });

  return NextResponse.json(
    { error: 'Internal server error', details: error.message },
    { status: 500 }
  );
};

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database');
    
    console.log('Finding blog with slug:', params.slug);
    const blog = await Blog.findOne({ 
      slug: params.slug,
      isPublished: true 
    }).lean();

    if (!blog) {
      console.log('Blog not found:', params.slug);
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    type MongoDoc = {
      _id: Types.ObjectId;
      [key: string]: any;
    };

    // Find related posts based on categories and tags
    const relatedPosts = await Blog.find({
      _id: { $ne: (blog as MongoDoc)._id },
      isPublished: true,
      $or: [
        { categories: { $in: (blog as MongoDoc).categories } },
        { tags: { $in: (blog as MongoDoc).tags } }
      ]
    })
    .select('title summary image slug publishedAt readingTime categories')
    .sort('-publishedAt')
    .limit(3)
    .lean();

    console.log('Found related posts:', relatedPosts.length);

    // Update views in a separate query to avoid race conditions
    await Blog.findByIdAndUpdate((blog as MongoDoc)._id, { $inc: { views: 1 } });

    return NextResponse.json({
      blog: blog as unknown as IBlog,
      relatedPosts: relatedPosts as unknown as IBlog[]
    });

  } catch (error) {
    console.error('Error fetching blog:', error);
    return handleError(error);
  }
} 