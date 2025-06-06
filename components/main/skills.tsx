"use client";

import { SkillText } from "@/components/sub/skill-text";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import {
  BACKEND_SKILL,
  FRONTEND_SKILL,
  FULLSTACK_SKILL,
  OTHER_SKILL,
  SKILL_DATA,
} from "@/constants";

export const Skills = () => {
  // Combine all skill images into a single array
  const allSkillImages = [
    ...SKILL_DATA,
    ...FRONTEND_SKILL,
    ...BACKEND_SKILL,
    ...FULLSTACK_SKILL,
    ...OTHER_SKILL,
  ].map(skill => `/skills/${skill.image}`);

  // Remove duplicates
  const uniqueSkillImages = Array.from(new Set(allSkillImages));

  return (
    <section
      id="skills"
      className="min-h-[800px] h-screen w-full relative flex flex-col items-center justify-start py-10"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <SkillText />
      </div>

      <div className="w-full flex-1 relative">
        <ThreeDMarquee images={uniqueSkillImages} />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 z-[-10] opacity-30 flex items-center justify-center bg-cover">
          <video
            className="w-full h-full object-cover"
            preload="false"
            playsInline
            loop
            muted
            autoPlay
          >
            <source src="/videos/skills-bg.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </section>
  );
};
