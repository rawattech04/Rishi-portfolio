"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useBlogList } from "@/hooks/useBlog";
import { BlogCardSkeleton } from "@/components/sub/skeleton";

export const Blogs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { blogs, loading } = useBlogList({
    limit: 9,
  });

  const totalCards = blogs.length;

  const slide = (direction: "left" | "right") => {
    if (isTransitioning || totalCards < 3) return;
    setIsTransitioning(true);
    if (direction === "left") {
      setCurrentIndex((prev) => (prev === 0 ? totalCards - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === totalCards - 1 ? 0 : prev + 1));
    }
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const getVisibleCards = () => {
    if (totalCards < 3) return blogs;
    const cards = [];
    const prevIndex = currentIndex === 0 ? totalCards - 1 : currentIndex - 1;
    const nextIndex = currentIndex === totalCards - 1 ? 0 : currentIndex + 1;

    cards.push(blogs[prevIndex]);
    cards.push(blogs[currentIndex]);
    cards.push(blogs[nextIndex]);

    return cards;
  };

  const getCardStyle = (position: "left" | "center" | "right") => {
    const baseStyle =
      "absolute top-0 transition-all duration-500 ease-in-out w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw] cursor-pointer transform-gpu";

    switch (position) {
      case "left":
        return `${baseStyle} left-1/2 -translate-x-[150%] opacity-50 scale-90 -rotate-6 hover:opacity-60 hover:scale-95 z-10`;
      case "center":
        return `${baseStyle} left-1/2 -translate-x-1/2 opacity-100 scale-100 z-20 hover:scale-[1.05]`;
      case "right":
        return `${baseStyle} left-1/2 translate-x-[50%] opacity-50 scale-90 rotate-6 hover:opacity-60 hover:scale-95 z-10`;
    }
  };

  const handleCardClick = (position: "left" | "right") => {
    if (isTransitioning) return;
    slide(position);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full z-10 px-4 sm:px-10 md:px-10 lg:px-20 py-32 overflow-hidden ">
      <h1 className="text-3xl sm:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-center mb-10">
        Latest Blog Posts
      </h1>

      {loading ? (
        <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px]">
          {[...Array(3)].map((_, idx) => {
            const position = idx === 0 ? "left" : idx === 1 ? "center" : "right";
            return (
              <div key={idx} className={getCardStyle(position)}>
                <BlogCardSkeleton />
              </div>
            );
          })}
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-gray-400 text-center">No blogs found.</p>
      ) : (
        <>
          {/* Navigation buttons */}
          <button
            onClick={() => slide("left")}
            disabled={isTransitioning || totalCards < 3}
            className="absolute left-4 sm:left-10 md:left-20 top-[55%] z-40 bg-[#0C0C0C]/90 border border-[#2A0E61] p-2 sm:p-4 rounded-full hover:scale-110 transition-all duration-300 hover:bg-purple-600/20 disabled:opacity-50"
          >
            <FaChevronLeft size={20} className="text-white" />
          </button>

          <button
            onClick={() => slide("right")}
            disabled={isTransitioning || totalCards < 3}
            className="absolute right-4 sm:right-10 md:right-20 top-[55%] z-40 bg-[#0C0C0C]/90 border border-[#2A0E61] p-2 sm:p-4 rounded-full hover:scale-110 transition-all duration-300 hover:bg-purple-600/20 disabled:opacity-50"
          >
            <FaChevronRight size={20} className="text-white" />
          </button>

          {/* Carousel */}
          <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] overflow-visible">
            {getVisibleCards().map((blog, idx) => {
              const position = idx === 0 ? "left" : idx === 1 ? "center" : "right";
              return (
                <div
                  key={`${blog._id}-${position}`}
                  className={getCardStyle(position)}
                  onClick={() =>
                    position !== "center" && handleCardClick(position as "left" | "right")
                  }
                >
                  <div className="rounded-2xl overflow-hidden bg-[#0C0C0C] border border-[#2A0E61] hover:border-purple-500/50 h-full flex flex-col">
                    <div className="relative w-full h-[180px] sm:h-[200px] md:h-[250px] lg:h-[300px] shrink-0">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-3 sm:gap-4 flex-grow">
                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white">
                        {blog.title}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-gray-400 line-clamp-2 md:line-clamp-3 flex-grow">
                        {blog.summary}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {blog.categories.map((category, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="inline-block bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 sm:px-6 py-2 rounded-lg text-center text-sm sm:text-base hover:opacity-90 hover:scale-105 mt-2 transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edge gradients */}
          <div className="pointer-events-none absolute left-0 top-0 w-8 sm:w-16 md:w-24 lg:w-32 h-full bg-gradient-to-r from-[#0C0C0C] via-[#0C0C0C]/80 to-transparent z-30" />
          <div className="pointer-events-none absolute right-0 top-0 w-8 sm:w-16 md:w-24 lg:w-32 h-full bg-gradient-to-l from-[#0C0C0C] via-[#0C0C0C]/80 to-transparent z-30" />
        </>
      )}
    </div>
  );
};
