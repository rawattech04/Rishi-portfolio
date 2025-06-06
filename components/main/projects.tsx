"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { ProjectCard } from "@/components/sub/project-card";
import { ProjectDetail } from "@/components/sub/project-detail";
import { StarsCanvas } from "@/components/main/star-background";
import { getProjects } from "@/services/projectService";
import { Project } from "@/types/project";
import { ProjectCardSkeleton } from "@/components/sub/skeleton";

const PROJECT_COLORS = [
  "border-purple-600",
  "border-cyan-500",
  "border-amber-500",
  "border-emerald-500",
  "border-pink-500",
  "border-indigo-500"
];

export const Projects = () => {
  const [activeProject, setActiveProject] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef });

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjects();
      setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const scrollY = window.scrollY + window.innerHeight * 0.3;
      const progress = Math.min(Math.max((scrollY - sectionTop) / (sectionHeight - window.innerHeight), 0), 1);
      const newIndex = Math.floor(progress * projects.length);

      if (newIndex !== activeProject) {
        setActiveProject(Math.min(newIndex, projects.length - 1));
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeProject, projects.length]);

  if (loading) {
    return (
      <section className="w-full bg-[#030014] py-0 relative mt-4 h-screen flex items-center justify-center">
        <div className="sticky top-0 h-screen flex flex-col justify-center items-center z-10">
          <div className="text-center mb-8">
            <p className="text-xl uppercase tracking-widest text-purple-400 font-medium mb-5">
              FEATURED CASE STUDIES
            </p>
            <h1 className="text-[56px] max-md:text-[36px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
              My Projects
            </h1>
          </div>

          <div className="w-full max-w-7xl mx-auto px-4">
            {[...Array(1)].map((_, idx) => (
              <div key={idx} className="mb-8">
                <ProjectCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!projects.length) {
    return (
      <section className="w-full bg-[#030014] py-0 relative mt-4 h-screen flex items-center justify-center">
        <div className="text-white">No projects found.</div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full bg-[#030014] py-0 relative mt-4"
      style={{ minHeight: `${projects.length * 140}vh` }}
    >
      {/* Stars background */}
      <div className="absolute inset-0 z-0">
        <StarsCanvas />
      </div>
      
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center z-10">
        <div className="text-center mb-8">
          <p className="text-xl uppercase tracking-widest text-purple-400 font-medium mb-5">
            FEATURED CASE STUDIES
          </p>
          <h1 className="text-[56px] max-md:text-[36px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            My Projects
          </h1>
        </div>

        {/* Main Container - Changes flex direction based on screen size */}
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center w-full max-w-7xl mx-auto gap-2 h-full`}>
          
          {/* Project Cards Section */}
          <div className={`${isMobile ? 'w-full' : 'w-1/2'} flex justify-center items-center`}>
            {/* Desktop Layout - Vertical Stacking */}
            {!isMobile && (
              <div className="relative w-full max-w-2xl h-[600px] flex justify-center items-center">
                {projects.map((project, index) => {
                  const isActive = index === activeProject;
                  const yOffset = (index - activeProject) * 800; 
                  const opacity = isActive ? 1 : 0.3;
                  const scale = isActive ? 1 : 0.85;
                  const zIndex = isActive ? 10 : 0;

                  return (
                    <motion.div
                      key={project.id}
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
                        link={project.liveUrl || '#'}
                        index={index}
                        active={isActive}
                        handleClick={() => setActiveProject(index)}
                        borderColor={PROJECT_COLORS[index % PROJECT_COLORS.length]}
                      />
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Mobile Layout - Horizontal Sliding */}
            {isMobile && (
              <div className="relative w-full h-[600px] flex justify-center items-center overflow-hidden">
                <div className="flex items-center justify-center">
                  {projects.map((project, index) => {
                    const isActive = index === activeProject;
                    const xOffset = (index - activeProject) * 280; 
                    const opacity = Math.abs(index - activeProject) <= 1 ? (isActive ? 1 : 0.6) : 0;
                    const scale = isActive ? 1 : 0.8;
                    const zIndex = isActive ? 10 : Math.abs(index - activeProject) <= 1 ? 5 : 0;

                    return (
                      <motion.div
                        key={project.id}
                        className="absolute flex-shrink-0"
                        style={{ width: '280px' }}
                        initial={{ opacity: 0, x: 300 }}
                        animate={{
                          opacity,
                          x: xOffset,
                          scale,
                          zIndex
                        }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <ProjectCard
                          src={project.image}
                          title={project.title}
                          description={project.description}
                          link={project.liveUrl || '#'}
                          index={index}
                          active={isActive}
                          handleClick={() => setActiveProject(index)}
                          borderColor={PROJECT_COLORS[index % PROJECT_COLORS.length]}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Project Details Section */}
          <div className={`${isMobile ? 'w-full' : 'w-1/2'} px-4`}>
            <div
              className={`${isMobile ? 'max-w-lg mx-auto border-t-4' : 'max-w-xl border-l-4'}  rounded-2xl bg-[#0d0b1a] ${
                PROJECT_COLORS[activeProject % PROJECT_COLORS.length]
              }`}
            >
              <AnimatePresence mode="wait">
                {projects[activeProject] && (
                  <ProjectDetail
                    key={projects[activeProject].id}
                    title={projects[activeProject].title}
                    description={projects[activeProject].description}
                    technologies={projects[activeProject].technologies}
                    themeColor={PROJECT_COLORS[activeProject % PROJECT_COLORS.length]}
                    projectLink={projects[activeProject].liveUrl || '#'}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Progress Indicators */}
        {isMobile && (
          <div className="flex justify-center space-x-2 mt-6">
            {projects.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-300 ${
                  index === activeProject ? 'bg-purple-500' : 'bg-gray-600'
                }`}
                onClick={() => setActiveProject(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};