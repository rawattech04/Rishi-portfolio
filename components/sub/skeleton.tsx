import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a]",
        className
      )}
    />
  );
};

export const BlogCardSkeleton = () => {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#0C0C0C] border border-[#2A0E61]">
      <Skeleton className="w-full h-[200px] md:h-[250px] lg:h-[300px]" />
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};

export const ProjectCardSkeleton = () => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      {/* Project Card */}
      <div className="w-full md:w-1/2">
        <div className="rounded-2xl overflow-hidden bg-[#0C0C0C] border border-[#2A0E61] p-4">
          <Skeleton className="w-full h-[200px] rounded-xl" />
          <div className="mt-4">
            <Skeleton className="h-8 w-3/4 mb-3" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
      
      {/* Project Details */}
      <div className="w-full md:w-1/2">
        <div className="rounded-2xl bg-[#0C0C0C] border border-[#2A0E61] p-6">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-24 w-full mb-6" />
          <div className="flex flex-wrap gap-2 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    </div>
  );
}; 