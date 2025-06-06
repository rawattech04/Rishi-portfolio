import { useState, useEffect } from 'react';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  summary: string;
  image: string;
  slug: string;
  author: string;
  tags: string[];
  categories: string[];
  views: number;
  readingTime: number;
  publishedAt: string;
  sections?: {
    title: string;
    content: string;
    image?: string;
  }[];
}

interface PaginationData {
  total: number;
  page: number;
  pages: number;
}

interface BlogListResponse {
  blogs: BlogPost[];
  pagination: PaginationData;
}

interface BlogDetailResponse {
  blog: BlogPost;
  relatedPosts: BlogPost[];
}

interface UseBlogOptions {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  category?: string;
}

export function useBlogList(options: UseBlogOptions = {}) {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    pages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page: options.page?.toString() || '1',
          limit: options.limit?.toString() || '10',
          ...(options.search && { search: options.search }),
          ...(options.tag && { tag: options.tag }),
          ...(options.category && { category: options.category })
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs?${queryParams}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }

        const data: BlogListResponse = await response.json();
        setBlogs(data.blogs);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [options.page, options.limit, options.search, options.tag, options.category]);

  return { blogs, pagination, loading, error };
}

export function useBlogDetail(slug: string) {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog');
        }

        const data: BlogDetailResponse = await response.json();
        setBlog(data.blog);
        setRelatedPosts(data.relatedPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  return { blog, relatedPosts, loading, error };
}

// Admin hooks for CRUD operations
export function useAdminBlog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBlog = async (blogData: Partial<BlogPost>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create blog');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (id: string, blogData: Partial<BlogPost>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/blogs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...blogData }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update blog');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/blogs?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete blog');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBlog,
    updateBlog,
    deleteBlog,
    loading,
    error,
  };
} 