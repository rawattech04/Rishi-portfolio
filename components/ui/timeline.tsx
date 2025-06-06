"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  sectionId: string;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 90%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);

  // Observer for sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    data.forEach((section) => {
      const element = document.getElementById(section.sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [data]);

  return (
    <div className="h-full relative" ref={containerRef}>
      <div ref={ref} className="h-full flex items-center">
        {/* Progress line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-gray-100">
          <motion.div
            style={{ height: heightTransform }}
            className="absolute inset-x-0 top-0 w-full bg-gradient-to-b from-purple-500 to-blue-500"
          />
        </div>

        {/* Section markers */}
        <div className="relative h-full w-full">
          {data.map((entry, index) => {
            const isActive = entry.sectionId === activeSection;
            const progress = (index + 1) / data.length * 100;
            
            return (
              <div
                key={entry.sectionId}
                style={{ top: `${progress}%` }}
                className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <div 
                  className={`relative group cursor-pointer ${isActive ? 'scale-110' : ''}`}
                >
                  <div 
                    className={`w-2 h-2 rounded-full transition-all duration-300
                      ${isActive ? 'bg-purple-500' : 'bg-gray-300'}
                      group-hover:bg-purple-400`}
                  />
                  
                  {/* Title tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute left-4 transform -translate-y-1/2 top-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap transition-opacity duration-200">
                    {entry.title.split(' ').slice(0, 2).join(' ')}...
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 