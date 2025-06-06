'use client';

import Image from 'next/image';

interface BlogImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export default function BlogImage({ src, alt, priority = false, className = '' }: BlogImageProps) {
  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg bg-[#0C0C0C]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 66vw"
        className={`object-cover ${className}`}
        priority={priority}
        onError={(e: any) => {
          console.error('Failed to load image:', src);
          e.currentTarget.parentElement.style.backgroundColor = '#1A1A1A';
        }}
      />
    </div>
  );
} 