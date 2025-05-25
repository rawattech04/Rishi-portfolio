"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaLinkedinIn, FaGithub, FaInstagram } from "react-icons/fa";
import { SiUpwork, SiFreelancer } from "react-icons/si";
import { slideInFromTop, slideInFromLeft, slideInFromRight } from "@/lib/motion";
import { FaX } from "react-icons/fa6";

export const Encryption = () => {
  return (
    <div className="flex flex-col relative items-center justify-center min-h-screen w-full h-full">
      <div className="absolute w-auto h-auto top-0 z-[5]">
        <motion.div
          variants={slideInFromTop}
          className="text-[40px] font-medium text-center text-gray-200"
        >
          Social{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            Connect
          </span>{" "}
          with me
        </motion.div>
      </div>

      <div className="flex flex-col items-center justify-center translate-y-[-50px] absolute z-[20] w-auto h-auto">
        <div className="flex flex-col items-center group cursor-pointer w-auto h-auto">
          <Image
            src="/lock-top.png"
            alt="Lock top"
            width={50}
            height={50}
            className="translate-y-5 transition-all duration-200 group-hover:translate-y-11"
          />
          <Image
            src="/lock-main.png"
            alt="Lock main"
            width={70}
            height={70}
            className="z-10"
          />
        </div>

        <div className="Welcome-box px-[15px] py-[4px] z-[20] border my-[20px] border-[#7042F88B] opacity-[0.9]">
          <h1 className="Welcome-text text-[12px]">Connect With Me</h1>
        </div>
      </div>

      {/* Social Media Cards Grid */}
      <motion.div 
        variants={slideInFromTop}
        className="grid grid-cols-12 gap-4 z-[20] max-w-[81.5%] px-4 w-full mt-12"
      >
        {/* Twitter Card */}
        <motion.div 
          variants={slideInFromLeft(0.5)}
          className="col-span-4 bg-[#0f0f0f80] backdrop-blur-sm border border-[#7042F88B] rounded-xl p-4 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/50 transition-all duration-300"
        >
          <div className="flex flex-col w-full max-w-md  rounded-lg ">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  <FaX className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 font-semibold text-sm">
                    X
                  </p>
                  <p className="text-xs text-gray-400">@Rishi_Rawat_04</p>
                </div>
              </div>
              <a
                href="https://x.com/Rishi_Rawat_04"
                target="_blank"
                rel="noopener noreferrer"
                className="z-[1001]"
              >
                <button className="bg-gradient-to-r z-[1001] from-purple-500 to-cyan-500 text-white px-4 py-1 rounded-full text-xs hover:opacity-80 transition-all duration-300">
                  Follow
                </button>
              </a>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mt-1">
              🚧 Head of Community • Rawat Tech <br /> • Passionate about community & innovation <br />
              👨‍💻 Software Developer • AWS | Node.js | React | Web3
            </p>
            <div className="w-full h-32 relative rounded-lg overflow-hidden mt-3">
              <Image
                src="/twitter.png"
                alt="twitter Preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </motion.div>

        {/* LinkedIn Card */}
        <motion.div 
          variants={slideInFromRight(0.5)}
          className="col-span-8 flex flex-row bg-[#0f0f0f80] backdrop-blur-sm border border-[#7042F88B] rounded-xl p-4 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/50 transition-all duration-300"
        >
          <div className="flex flex-col justify-between w-1/2 pr-4">
            <div className="flex flex-col space-y-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FaLinkedinIn className="text-white text-xl" />
              </div>
              <div>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 font-medium text-sm">
                  www.linkedin.com
                </p>
                <p className="text-sm text-gray-400 break-all">
                  linkedin.com/in/rishi-rawat-a6632a251
                </p>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                👨‍💼 Full-Stack Developer | React, Node.js, AWS<br />
                🌐 Community Contributor at Web3 Projects<br />
                🚀 Passionate about scaling tech & connecting people
              </p>
            </div>
            <a
              href="https://www.linkedin.com/in/rishi-rawat-a6632a251"
              target="_blank"
              rel="noopener noreferrer"
              className="z-10"
            >
              <button className="bg-gradient-to-r z-10 from-purple-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm hover:opacity-80 transition-all duration-300 mt-4">
                Connect
              </button>
            </a>
          </div>
          <div className=" relative rounded-lg overflow-hidden w-full">
            <Image
              src="/linkdin.png"
              alt="LinkedIn Preview"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </motion.div>

        {/* GitHub Card */}
        <motion.div 
          variants={slideInFromLeft(0.7)}
          className="col-span-3 bg-[#0f0f0f80] backdrop-blur-sm border border-[#7042F88B] rounded-xl p-4 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/50 transition-all duration-300 flex flex-col items-center justify-center"
        >
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
            <FaGithub className="text-white text-2xl" />
          </div>
          <p className="text-gray-200 font-semibold">Rishi Rawat</p>
          <p className="text-xs text-gray-400 mb-3 text-center">Building open-source, exploring full-stack, and loving React.</p>
          <a href="https://github.com/rishirawat04" target="_blank" rel="noopener noreferrer">
            <button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm hover:opacity-80 transition-all duration-300">
              Follow
            </button>
          </a>
        </motion.div>

        {/* Central Message Card */}
        <motion.div 
          variants={slideInFromTop}
          className="col-span-6 bg-[#0f0f0f80] backdrop-blur-sm border border-[#7042F88B] rounded-xl p-1 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/50 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="w-full h-40 rounded-lg overflow-hidden mb-4 relative">
              <Image 
                src="/villagedev.jpg" 
                alt="Village" 
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="px-4 pb-4 flex-1 flex items-center justify-center">
              <p className="text-center text-sm sm:text-base text-gray-200 leading-relaxed font-light">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-semibold">
                  Connect with me
                </span>{" "}
                and let’s see where our paths take us. <br className="hidden sm:block" />
                Let’s build something magical together! ✨
              </p>
            </div>
          </div>
        </motion.div>

        {/* Instagram Card */}
        <motion.div 
          variants={slideInFromRight(0.5)}
          className="col-span-3 bg-[#0f0f0f80] backdrop-blur-sm border border-[#7042F88B] rounded-xl p-4 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/50 transition-all duration-300 flex flex-col items-center justify-center"
        >
          <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-3">
            <FaInstagram className="text-white text-2xl" />
          </div>
          <p className="text-gray-200 font-semibold">Rishi Rawat</p>
          <p className="text-xs text-gray-400 mb-3 text-center">Snippets of my dev journey & everyday creativity.</p>
          <a href="https://instagram.com/rishitech04" target="_blank" rel="noopener noreferrer">
            <button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm hover:opacity-80 transition-all duration-300">
              Follow
            </button>
          </a>
        </motion.div>

        {/* Upwork Card */}
        <motion.div 
          variants={slideInFromLeft(0.7)}
          className="col-span-6 bg-[#0f0f0f80] backdrop-blur-sm border border-[#7042F88B] rounded-xl p-4 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/50 transition-all duration-300 flex flex-col items-center justify-center"
        >
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-3">
            <SiUpwork className="text-white text-2xl" />
          </div>
          <p className="text-gray-200 font-semibold">Upwork Freelancer</p>
          <p className="text-xs text-gray-400 mb-3 text-center">Hire me for remote React, AWS & full-stack projects.</p>
          <a href="https://www.upwork.com/freelancers/~014d03d2c1e31483c9" target="_blank" rel="noopener noreferrer">
            <button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm hover:opacity-80 transition-all duration-300">
              Hire Me
            </button>
          </a>
        </motion.div>

        {/* Freelancer Card */}
        <motion.div 
          variants={slideInFromLeft(0.7)}
          className="col-span-6 bg-[#0f0f0f80] backdrop-blur-sm border border-[#7042F88B] rounded-xl p-4 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/50 transition-all duration-300 flex flex-col items-center justify-center"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3">
            <SiFreelancer className="text-white text-2xl" />
          </div>
          <p className="text-gray-200 font-semibold">Freelancer India</p>
          <p className="text-xs text-gray-400 mb-3 text-center">Available for freelance gigs in web & cloud solutions.</p>
          <a href="https://www.freelancer.in/u/rishir61" target="_blank" rel="noopener noreferrer" className="z-50">
            <button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm hover:opacity-80 transition-all duration-300 z-50">
              Hire Me
            </button>
          </a>
        </motion.div>
      </motion.div>

      {/* Background Video */}
      <div className="w-full flex items-start justify-center absolute">
        <video
          loop
          muted
          autoPlay
          playsInline
          preload="false"
          className="w-full h-auto"
        >
          <source src="/videos/encryption-bg.webm" type="video/webm" />
        </video>
      </div>
    </div>
  );
};
