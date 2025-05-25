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
      bg-[#0F0F0F]/80 backdrop-blur-sm border-[5px] ${active ? borderColor : 'border-[#2A2A2A]/70'}`}
      onClick={() => handleClick(index)}
    >
      {/* Card glow effect */}
      {active && (
        <div 
          className={`absolute -inset-3 rounded-2xl opacity-60 blur-xl -z-10 ${borderColor.replace('border', 'bg')}`}
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
          className={`object-cover object-center transition-all duration-1000 ${active ? 'scale-100' : 'scale-110'}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={index === 0}
        />
        <div className={`absolute inset-0 ${active ? 'bg-gradient-to-b from-black/40 to-black/80' : 'bg-gradient-to-b from-black/60 to-black/90'}`} />
        
        <div className={`absolute top-6 right-6 px-4 py-2 rounded-lg text-base font-medium ${borderColor.replace('border', 'bg')} text-white`}>
          Project {index + 1}
        </div>
      </div>

      <div className="p-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className={`text-5xl font-bold mb-6 ${active ? 'text-white' : 'text-gray-200'}`}>{title}</h2>
          <p className={`text-2xl leading-relaxed line-clamp-3 md:line-clamp-4 ${active ? 'text-gray-300' : 'text-gray-400'}`}>{description}</p>
          
          <div className="mt-12 flex items-center justify-between">
            <Link
              href={link}
              target="_blank"
              rel="noreferrer noopener"
              className={`text-2xl font-medium hover:opacity-80 transition-colors flex items-center gap-3 group ${borderColor.replace('border-', 'text-')}`}
              onClick={(e) => e.stopPropagation()}
            >
              View Project
              <FiExternalLink className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={28} />
            </Link>
            <Link
              href="https://github.com/rishirawat04"
              target="_blank"
              rel="noreferrer noopener"
              className="text-gray-400 hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FiGithub size={32} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
