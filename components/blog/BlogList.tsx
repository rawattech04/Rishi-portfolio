'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface BlogPost {
  _id: string;
  title: string;
  summary: string;
  image: string;
  slug: string;
  publishedAt: string;
  readingTime: number;
  categories: string[];
}

export default function BlogList() {
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const query = searchParams.get('q') || '';
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs?search=${query}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }

        const data = await response.json();
        setBlogs(data.blogs);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [searchParams]);

  if (loading) {
    return <BlogListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No blogs found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog) => (
        <Link
          key={blog._id}
          href={`/blog/${blog.slug}`}
          className="block group"
        >
          <div className="rounded-xl overflow-hidden bg-[#0C0C0C] border border-[#2A0E61] transition-all duration-300 hover:border-purple-500/50">
            <div className="relative w-full h-48">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-purple-400">
                  {new Date(blog.publishedAt).toLocaleDateString()}
                </span>
                <span className="text-sm text-gray-400">
                  {blog.readingTime} min read
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors">
                {blog.title}
              </h3>
              <p className="text-gray-400 line-clamp-2">{blog.summary}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function BlogListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="rounded-xl overflow-hidden bg-[#0C0C0C] border border-[#2A0E61]">
            <div className="w-full h-48 bg-gray-800" />
            <div className="p-6">
              <div className="h-4 bg-gray-800 rounded w-1/4 mb-4" />
              <div className="h-6 bg-gray-800 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-800 rounded w-full mb-4" />
              <div className="h-4 bg-gray-800 rounded w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 