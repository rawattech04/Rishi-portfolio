"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiExternalLink, FiGithub } from "react-icons/fi";

type ProjectCardProps = {
  src: string;
  title: string;
  description: string;
  link: string;
  index: number;
  active: boolean;
  handleClick: (index: number) => void;
  borderColor?: string;
};

export const ProjectCard = ({
  src,
  title,
  description,
  link,
  index,
  active,
  handleClick,
  borderColor = "border-[#2A2A2A]/50"
}: ProjectCardProps) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl transition-all duration-500 ease-out w-full h-full 
      ${active ? 'shadow-2xl' : 'shadow-xl'} 
      bg-[#0F0F0F]/80 backdrop-blur-sm border-[3px] ${active ? borderColor : 'border-[#2A2A2A]/70'}`}
      onClick={() => handleClick(index)}
    >
      {/* Card glow effect */}
      {active && (
        <div 
          className={`absolute -inset-2 rounded-2xl opacity-60 blur-xl -z-10 ${borderColor.replace('border', 'bg')}`}
          style={{
            background: `radial-gradient(circle at center, ${borderColor.replace('border-', 'var(--tw-)')} 0%, transparent 70%)`
          }}
        />
      )}

      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={src}
          alt={title}
          fill
          className={`object-cover object-center transition-all duration-1000 ${active ? 'scale-100' : 'scale-105'}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={index === 0}
        />
        <div className={`absolute inset-0 ${active ? 'bg-gradient-to-b from-black/40 to-black/80' : 'bg-gradient-to-b from-black/60 to-black/90'}`} />
        
        {/* Project number badge - Always visible */}
        <div 
          className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-500
          ${active ? borderColor.replace('border', 'bg') : 'bg-gray-800'} text-white z-10`}
        >
          Project {index + 1}
        </div>
      </div>

      <div className="p-6 md:p-8 lg:p-10 flex flex-col h-full justify-between">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${active ? 'text-white' : 'text-gray-200'}`}>{title}</h2>
          <p className={`text-base md:text-lg lg:text-xl leading-relaxed line-clamp-3 ${active ? 'text-gray-300' : 'text-gray-400'}`}>{description}</p>
        </motion.div>
        
        {/* Links section - Always visible */}
        <motion.div 
          className="mt-6 md:mt-8 flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* <Link
            href={link}
            target="_blank"
            rel="noreferrer noopener"
            className={`text-base md:text-lg font-medium transition-colors flex items-center gap-2 group 
            ${active ? borderColor.replace('border-', 'text-') : 'text-gray-400'} hover:opacity-80`}
            onClick={(e) => e.stopPropagation()}
          >
            View Project
            <FiExternalLink 
              className="inline-block ml-1 group-hover:translate-x-1 transition-transform" 
              size={20} 
            />
          </Link> */}
          <Link
            href="https://github.com/rishirawat04"
            target="_blank"
            rel="noreferrer noopener"
            className="text-gray-400 hover:text-white transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <FiGithub size={24} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
