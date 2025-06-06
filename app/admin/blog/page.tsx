'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BlogsTable from '@/components/BlogsTable';
import { getAuthHeaders } from '@/lib/auth';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface BlogSection {
  title: string;
  content: string;
  image?: string;
}

interface Blog {
  _id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  author: string;
  tags: string[];
  categories: string[];
  isPublished: boolean;
  publishedAt?: string;
  sections?: BlogSection[];
  slug: string;
  views?: number;
  readingTime?: number;
  keywords?: string[];
  metaDescription?: string;
  relatedPosts?: string[];
}

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const response = await fetch('/api/admin/blogs', {
        headers: headers as HeadersInit
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch blogs');
      }

      const data = await response.json();
      setBlogs(data.blogs);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch blogs';
      setError(message);
      toast.error(message);
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/admin/signin');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id: string) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: headers as HeadersInit
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete blog');
      }

      await fetchBlogs();
      toast.success('Blog deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete blog';
      toast.error(message);
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        router.push('/admin/signin');
      }
    }
  };

  const handleEdit = (blog: Blog) => {
    router.push(`/admin/blog/edit/${blog._id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          New Blog Post
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <BlogsTable
          blogs={blogs}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isAdminView={true}
        />
      )}
    </div>
  );
}
