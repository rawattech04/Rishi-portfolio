import { HeroContent } from "@/components/sub/hero-content";

export const Hero = () => {
  return (
    <div className="relative flex flex-col min-h-screen w-full">
 
      <div className="absolute w-full h-full -z-20">
        <video
          autoPlay
          muted
          loop
          className="rotate-180 absolute top-[-1000px] sm:top-[-500px] md:top-[-700px] lg:top-[-400px] left-0 w-full h-full object-cover"
        >
          <source src="/videos/blackhole.webm" type="video/webm" />
        </video>
      </div>


      <div className="mt-24 sm:mt-32 md:mt-40 px-4 sm:px-8 md:px-0 w-full flex justify-center">
        <HeroContent />
      </div>
    </div>
  );
};
