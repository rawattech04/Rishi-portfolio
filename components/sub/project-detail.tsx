"use client";

import { motion } from "framer-motion";

type ProjectDetailProps = {
  title: string;
  description: string;
  technologies: readonly string[];
  themeColor?: string;
  projectLink: string;
};

export const ProjectDetail = ({
  title,
  description,
  technologies,
  themeColor = "border-purple-500",
  projectLink
}: ProjectDetailProps) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        staggerChildren: 0.05,
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { 
        duration: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  // Convert border color class to text and bg color classes
  const textColorClass = themeColor.replace('border-', 'text-');
  const bgColorClass = themeColor.replace('border-', 'bg-');
  const bgColorLightClass = themeColor.replace('border-', 'bg-') + '/10';

  return (
    <motion.div
      className="flex flex-col justify-center w-full bg-black/30 backdrop-blur-sm rounded-xl p-8 relative overflow-hidden border border-[#2A2A2A]/50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className={`absolute -z-10 right-0 -top-20 w-[300px] h-[300px] rounded-full opacity-[0.03] blur-[80px] ${bgColorClass}`}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.03, 0.05, 0.03]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      <motion.h3
        className={`uppercase text-sm font-semibold tracking-wider mb-2 ${textColorClass}`}
        variants={itemVariants}
      >
        Project Overview
      </motion.h3>

      <motion.div 
        className="flex flex-wrap gap-2 mb-6"
        variants={itemVariants}
      >
        {technologies.map((tech, index) => (
          <motion.span
            key={index}
            className={`text-white px-3 py-1 rounded-md text-xs ${bgColorLightClass} border border-${themeColor.split('-')[1]}-500/30`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.2,
              delay: index * 0.03
            }}
          >
            {tech}
          </motion.span>
        ))}
      </motion.div>
      
      <motion.p 
        className="text-gray-300 text-sm leading-relaxed mb-6"
        variants={itemVariants}
      >
        {description}
      </motion.p>
      
      <motion.div 
        className="flex space-x-4"
        variants={itemVariants}
      >
        <a 
          href="https://github.com/rishirawat04?tab=repositories" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-[#1A1A1A] text-white rounded-md hover:bg-[#2A2A2A] transition-colors"
        >
          Source code
        </a>
        
        <a 
          href={projectLink} 
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium ${bgColorClass} text-white rounded-md hover:opacity-90 transition-colors`}
        >
          Visit Website
        </a>
      </motion.div>
    </motion.div>
  );
}; 