"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { ProjectCard } from "@/components/sub/project-card";
import { ProjectDetail } from "@/components/sub/project-detail";
import { PROJECTS } from "@/constants";
import { StarsCanvas } from "@/components/main/star-background";

const PROJECT_COLORS = [
  "border-purple-600",
  "border-cyan-500",
  "border-amber-500",
  "border-emerald-500",
  "border-pink-500",
  "border-indigo-500"
];

const EXTENDED_PROJECTS = [
  ...PROJECTS,
];

export const Projects = () => {
  const [activeProject, setActiveProject] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef });

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const scrollY = window.scrollY + window.innerHeight * 0.3;
      const progress = Math.min(Math.max((scrollY - sectionTop) / (sectionHeight - window.innerHeight), 0), 1);
      const newIndex = Math.floor(progress * EXTENDED_PROJECTS.length);

      if (newIndex !== activeProject) {
        setActiveProject(Math.min(newIndex, EXTENDED_PROJECTS.length - 1));
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeProject]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full bg-[#030014] py-0 relative"
      style={{ minHeight: `${EXTENDED_PROJECTS.length * 140}vh` }}
    >
      {/* Stars background */}
      <div className="absolute inset-0 z-0">
        <StarsCanvas />
      </div>
      
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center z-10">
        <div className="text-center">
          <p className="text-xl uppercase tracking-widest text-purple-400 font-medium mb-5">
            FEATURED CASE STUDIES
          </p>
          <h1 className="text-[56px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            My Projects
          </h1>
        </div>

     <div className="flex flex-row items-center justify-center w-full max-w-7xl mx-auto">
     <div className="relative w-full max-w-6xl h-[95vh] flex justify-center items-center">
  {EXTENDED_PROJECTS.map((project, index) => {
    const isActive = index === activeProject;
    const yOffset = (index - activeProject) * 1200; 
    const opacity = isActive ? 1 : 0.3;
    const scale = isActive ? 1 : 0.85;
    const zIndex = isActive ? 10 : 0;

    return (
      <motion.div
        key={index}
        className="absolute w-full px-3"
        initial={{ opacity: 0, y: 200 }}
        animate={{
          opacity,
          y: yOffset,
          scale,
          zIndex
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <ProjectCard
          src={project.image}
          title={project.title}
          description={project.description}
          link={project.link}
          index={index}
          active={isActive}
          handleClick={() => setActiveProject(index)}
          borderColor={PROJECT_COLORS[index % PROJECT_COLORS.length]}
        />
      </motion.div>
    );
  })}
</div>

<div className="w-full px-4 sm:px-6 lg:px-8 mt-16">
  <div
    className={`max-w-3xl mx-auto border-l-4 rounded-2xl bg-[#0d0b1a] ${
      PROJECT_COLORS[activeProject % PROJECT_COLORS.length]
    }`}
  >
    <AnimatePresence mode="wait">
      <ProjectDetail
        key={activeProject}
        title={EXTENDED_PROJECTS[activeProject].title}
        description={EXTENDED_PROJECTS[activeProject].description}
        technologies={EXTENDED_PROJECTS[activeProject].technologies}
        themeColor={PROJECT_COLORS[activeProject % PROJECT_COLORS.length]}
        projectLink={EXTENDED_PROJECTS[activeProject].link}
      />
    </AnimatePresence>
  </div>
</div>

     </div>
{/* 
        <motion.div 
          className="absolute bottom-10 flex items-center justify-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="mr-3 h-px w-6 bg-gray-700"></div>
          Scroll to explore projects
          <div className="ml-3 h-px w-6 bg-gray-700"></div>
        </motion.div> */}
      </div>

      {/* <motion.div 
        className="fixed left-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-amber-500 z-50"
        style={{ width: scrollYProgress.get() * 100 + '%', opacity: 0.7 }}
      ></motion.div> */}
    </section>
  );
};
