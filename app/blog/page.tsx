import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoSearch } from 'react-icons/io5';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogList from '@/components/blog/BlogList';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-4">
            Blog Posts
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our latest articles, tutorials, and insights about technology, programming, and web development.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <Suspense fallback={<SearchSkeleton />}>
            <BlogSearch />
          </Suspense>
        </div>

        {/* Blog List */}
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </div>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="relative">
      <div className="w-full h-12 bg-[#0C0C0C] border border-[#2A0E61] rounded-lg animate-pulse" />
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