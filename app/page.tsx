import { AboutPage } from "@/components/main/about";
import { Blogs } from "@/components/main/blogs";
import { Hero } from "@/components/main/hero";
import { Projects } from "@/components/main/projects";
import { Skills } from "@/components/main/skills";
import { StarsCanvas } from "@/components/main/star-background";

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-20">
      <StarsCanvas />
        <Hero />
        <Skills />
        <AboutPage />
        <Projects />
        <Blogs />
      </div>
    </main>
  );
}
