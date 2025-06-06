"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const ThreeDMarquee = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  // Create a much larger array by repeating the images many times for infinite effect
  const repeatedImages = Array(10).fill(images).flat();
  
  // Split the images array into 6 equal parts for more columns (reduced from 8 for larger images)
  const chunkSize = Math.ceil(repeatedImages.length / 6);
  const chunks = Array.from({ length: 6 }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return repeatedImages.slice(start, start + chunkSize);
  });

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden bg-transparent",
        className,
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="size-[3500px] shrink-0 scale-[0.25] sm:scale-[0.3] md:scale-[0.4] lg:scale-[0.5] xl:scale-[0.6]">
          <div
            style={{
              transform: "rotateX(60deg) rotateY(0deg) rotateZ(-45deg)",
            }}
            className="relative top-[800px] right-[35%] grid size-full origin-top-left grid-cols-6 gap-4 sm:gap-6 transform-3d"
          >
            {chunks.map((subarray, colIndex) => (
              <motion.div
                animate={{ 
                  y: [0, -1500, 0],
                }}
                transition={{
                  duration: 25 + colIndex * 2, // Slightly slower for smoother effect
                  repeat: Infinity,
                  ease: "linear",
                }}
                key={colIndex + "marquee"}
                className="flex flex-col items-start gap-4 sm:gap-6"
              >
                {subarray.map((image, imageIndex) => (
                  <motion.div
                    key={imageIndex + image}
                    className="relative"
                    whileHover={{
                      scale: 1.2,
                      rotate: 360,
                      z: 50,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: (colIndex + imageIndex) * 0.02,
                        duration: 0.3,
                      }}
                      src={image}
                      alt={`Skill ${imageIndex + 1}`}
                      className="h-24 w-24 sm:h-32 sm:w-32 md:h-32 md:w-32 lg:h-40 lg:w-40 xl:h-48 xl:w-48 rounded-2xl object-contain p-3 sm:p-4 transition-all duration-300 bg-white/5 backdrop-blur-sm hover:bg-white/10"
                      width={192}
                      height={192}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const GridLineHorizontal = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.1)",
          "--height": "1px",
          "--width": "4px",
          "--fade-stop": "90%",
          "--offset": offset || "200px",
          "--color-dark": "rgba(255, 255, 255, 0.1)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    ></div>
  );
};

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.1)",
          "--height": "4px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          "--color-dark": "rgba(255, 255, 255, 0.1)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    ></div>
  );
}; 