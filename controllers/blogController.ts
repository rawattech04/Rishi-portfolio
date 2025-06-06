import Blog from '@/models/Blog';
import { Types } from 'mongoose';

export async function getBlogs({ page = 1, limit = 10, search = '', tag, category, isPublished }: {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  category?: string;
  isPublished?: boolean;
}) {
  const query: any = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { summary: { $regex: search, $options: 'i' } }
    ];
  }
  if (tag) query.tags = tag;
  if (category) query.categories = category;
  if (typeof isPublished === 'boolean') query.isPublished = isPublished;

  const skip = (page - 1) * limit;
  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .select('-content')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit),
    Blog.countDocuments(query)
  ]);

  return {
    blogs,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
}

export async function getBlogBySlug(slug: string) {
  const blog = await Blog.findOne({ slug, isPublished: true });
  if (!blog) throw new Error('Blog not found');
  blog.views += 1;
  await blog.save();
  const relatedPosts = await blog.findRelatedPosts();
  return {
    blog: {
      ...blog.toJSON(),
      content: blog.content,
    },
    relatedPosts
  };
}

export async function createBlog(data: any) {
  const requiredFields = ['title', 'content', 'summary', 'image', 'author'];
  for (const field of requiredFields) {
    if (!data[field]) throw new Error(`${field} is required`);
  }
  const blog = new Blog(data);
  await blog.save();
  return blog;
}

export async function updateBlog(id: string, updateData: any) {
  if (!id) throw new Error('Blog ID is required');
  const blog = await Blog.findByIdAndUpdate(
    id,
    { ...updateData },
    { new: true, runValidators: true }
  );
  if (!blog) throw new Error('Blog not found');
  return blog;
}

export async function deleteBlog(id: string) {
  if (!id) throw new Error('Blog ID is required');
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) throw new Error('Blog not found');
  return { message: 'Blog deleted successfully' };
} 