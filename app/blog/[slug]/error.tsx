'use client';

import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Something went wrong!</h2>
        <p className="text-gray-400 mb-8">
          {error.message || "An error occurred while loading the blog post."}
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center text-purple-400 hover:text-purple-500"
          >
            <IoArrowBack className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 