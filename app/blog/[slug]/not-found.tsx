import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Blog Not Found</h2>
        <p className="text-gray-400 mb-8">
          The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center text-purple-400 hover:text-purple-500"
        >
          <IoArrowBack className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  )
} 