import Image from 'next/image';
import Link from 'next/link';
import { Timeline } from '@/components/ui/timeline';
import { Search } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { IoArrowBack } from "react-icons/io5";
import { notFound } from "next/navigation";
import { Input } from "@/components/ui/input";
import BlogImage from '@/components/blog/BlogImage';

async function getBlogData(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${slug}`, {
    next: { revalidate: 60 }, // Revalidate every minute
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error("Failed to fetch blog");
  }

  const data = await res.json();
  console.log('Blog data:', {
    title: data.blog.title,
    sections: data.blog.sections?.map((s: any) => ({
      title: s.title,
      imageUrl: s.image,
    }))
  });
  return data;
}

async function getAllBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  const data = await res.json();
  return data.blogs || []; 
}

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const [{ blog, relatedPosts }, allBlogsData] = await Promise.all([
    getBlogData(params.slug),
    getAllBlogs()
  ]);

  // Ensure allBlogs is an array and filter out the current blog
  const otherBlogs = Array.isArray(allBlogsData) 
    ? allBlogsData.filter((b: any) => b._id !== blog._id)
    : [];

  // Log section data for debugging
  console.log('Rendering blog sections:', blog.sections?.map((section: any) => ({
    title: section.title,
    hasContent: Boolean(section.content),
    imageUrl: section.image,
  })));

  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Navigation */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-purple-400 hover:text-purple-500 text-sm sm:text-base"
          >
            <IoArrowBack className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Back to Blogs
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Main Blog Content */}
          <article className="w-full lg:w-2/3 prose prose-invert max-w-none">
            <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] mb-6 sm:mb-8 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 66vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6 text-sm sm:text-base">
              <span className="text-purple-400">
                {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              {blog.categories?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.categories.map((category: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              {blog.title}
            </h1>

            {blog.summary && (
              <div className="mb-8 sm:mb-10">
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed border-l-4 border-purple-500 pl-4 italic">
                  {blog.summary}
                </p>
              </div>
            )}

            {blog.content && (
              <div className="mb-8 sm:mb-10">
                <div className="text-gray-300 leading-relaxed">
                  <p>{blog.content}</p>
                </div>
              </div>
            )}

            <div className="text-gray-300 leading-relaxed space-y-8 sm:space-y-12">
              {blog.sections?.map((section: any, index: number) => (
                <div key={section._id || index} className="space-y-6">
                  {section.title && (
                    <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                      {section.title}
                    </h2>
                  )}

                  {section.content && (
                    <div className="text-gray-300 leading-relaxed text-base sm:text-lg space-y-4">
                      {section.content.split('\n').map((paragraph: string, i: number) => (
                        paragraph.trim() && (
                          <p key={i} className="text-gray-300">
                            {paragraph}
                          </p>
                        )
                      ))}
                    </div>
                  )}

                  {section.image && (
                    <div className="mt-8">
                      <BlogImage
                        src={section.image}
                        alt={section.title || "Section image"}
                        priority={index === 0}
                      />
                      {section.title && (
                        <p className="mt-3 text-sm text-center text-gray-400 italic">
                          {section.title}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {blog.author && (
              <div className="mt-16 sm:mt-20 border-t border-[#2A0E61] pt-6 sm:pt-8">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-purple-500/20">
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-purple-400">
                      {blog.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Written by</h3>
                    <p className="text-purple-400">{blog.author}</p>
                  </div>
                </div>
              </div>
            )}
          </article>

          {/* Right Sidebar with Search and All Blogs */}
          <aside className="w-full lg:w-1/3 mt-8 lg:mt-0">
            <div className="sticky top-8 space-y-6 sm:space-y-8">
              {/* Search Bar */}
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search blogs..."
                  className="w-full pl-10 bg-[#0C0C0C] border-[#2A0E61] text-white h-11 sm:h-12"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-[#0C0C0C] border border-[#2A0E61] rounded-xl p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
                    <span className="mr-2">📚</span> Similar Articles
                  </h2>
                  <div className="space-y-4 sm:space-y-6">
                    {relatedPosts.map((post: any) => (
                      <Link
                        key={post._id}
                        href={`/blog/${post.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-3 sm:gap-4 bg-[#080808] p-3 rounded-xl transition-all duration-300 hover:bg-[#1A1A1A]">
                          <div className="relative w-24 sm:w-32 h-20 sm:h-24 flex-shrink-0">
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              sizes="(max-width: 640px) 96px, 128px"
                              className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div>
                            <h3 className="text-white text-sm sm:text-base font-medium group-hover:text-purple-400 transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {post.categories?.slice(0, 2).map((category: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full"
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
                </div>
              )}

              {/* All Blogs */}
              <div className="bg-[#0C0C0C] border border-[#2A0E61] rounded-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
                  <span className="mr-2">📝</span> All Articles
                </h2>
                <div className="space-y-4 sm:space-y-6 max-h-[500px] sm:max-h-[600px] overflow-y-auto custom-scrollbar">
                  {otherBlogs.map((post: any) => (
                    <Link
                      key={post._id}
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <div className="flex gap-3 sm:gap-4 bg-[#080808] p-3 rounded-xl transition-all duration-300 hover:bg-[#1A1A1A]">
                        <div className="relative w-24 sm:w-32 h-20 sm:h-24 flex-shrink-0">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="(max-width: 640px) 96px, 128px"
                            className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div>
                          <h3 className="text-white text-sm sm:text-base font-medium group-hover:text-purple-400 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {post.categories?.slice(0, 2).map((category: string, index: number) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full"
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
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div className="min-h-screen bg-[#030014]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <div className="w-24 h-8 bg-[#0C0C0C] rounded-lg animate-pulse" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          <div className="w-full lg:w-2/3">
            {/* Main Image */}
            <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] mb-6 sm:mb-8 rounded-2xl overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>

            {/* Meta Info */}
            <div className="flex gap-3 mb-6">
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>

            {/* Title */}
            <Skeleton className="h-10 sm:h-12 w-3/4 mb-8" />

            {/* Summary */}
            <div className="mb-8 sm:mb-10 border-l-4 border-purple-500 pl-4">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-5/6" />
            </div>

            {/* Content */}
            <div className="mb-8 sm:mb-10">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            {/* Sections */}
            <div className="space-y-12">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-6">
                  <Skeleton className="h-8 w-2/3" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="mt-8">
                    <Skeleton className="h-[300px] sm:h-[400px] w-full rounded-xl" />
                    <Skeleton className="h-4 w-48 mx-auto mt-3" />
                  </div>
                </div>
              ))}
            </div>

            {/* Author */}
            <div className="mt-16 sm:mt-20 border-t border-[#2A0E61] pt-6 sm:pt-8">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3">
            <div className="sticky top-8 space-y-6 sm:space-y-8">
              <Skeleton className="h-12 w-full rounded-lg" />
              
              <div className="bg-[#0C0C0C] border border-[#2A0E61] rounded-xl p-4 sm:p-6">
                <Skeleton className="h-6 w-40 mb-6" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="mb-4">
                    <div className="flex gap-3 sm:gap-4">
                      <Skeleton className="h-20 sm:h-24 w-24 sm:w-32 rounded-lg flex-shrink-0" />
                      <div className="flex-grow">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <div className="flex gap-2">
                          <Skeleton className="h-4 w-16 rounded-full" />
                          <Skeleton className="h-4 w-16 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 