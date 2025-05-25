import { HeroContent } from "@/components/sub/hero-content";

export const Hero = () => {
  return (
    <div className="relative flex flex-col h-full w-full">
      {/* Background video with no visible edges */}
      <div className="absolute   w-full h-full  -z-20 ">
        <video
          autoPlay
          muted
          loop
          className="rotate-180 absolute top-[-340px] left-0 w-full h-full object-cover"
        >
          <source src="/videos/blackhole.webm" type="video/webm" />
        </video>
      </div>

     <div className="mt-40">
      <HeroContent />
     </div>
    </div>
  );
};
