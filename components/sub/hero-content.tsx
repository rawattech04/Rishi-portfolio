"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";
import ArcReactorAssistant from "./arc-reactor-assistant";
import ContactModal from "./contact-modal";
import AIAssistant from "@/lib/ai-assistant";

export const HeroContent = () => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasTouchScreen, setHasTouchScreen] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState("--.-");
  const [isCharging, setIsCharging] = useState(false);
  const [assistantActive, setAssistantActive] = useState(false);
  const activationTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const reminderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivationTime = useRef<number>(-30000); 
  const lastDeactivationTime = useRef<number>(-30000); 
  const debounceTime = 3000; 

  // Track mouse position for dynamic cursor glow
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      containerRef.current.style.setProperty('--cursor-x', `${x}%`);
      containerRef.current.style.setProperty('--cursor-y', `${y}%`);
    }
  };

  // Helper function to cleanly deactivate the assistant
  const deactivateAssistant = () => {
    // Cancel any pending activation
    if (activationTimeout.current) {
      clearTimeout(activationTimeout.current);
      activationTimeout.current = null;
    }
    
    // Get assistant and cancel any ongoing speech/recognition
    const assistant = AIAssistant.getInstance();
    assistant.cancel();
    
    // Update states
    setAssistantActive(false);
    lastDeactivationTime.current = Date.now();
    
    // Clear any ongoing reminder
    if (reminderTimeoutRef.current) {
      clearTimeout(reminderTimeoutRef.current);
      setShowReminder(false);
    }
  };

  // Handle showing contact modal
  const handleShowContactModal = () => {
    setShowContactModal(true);
  };

  // Handle closing contact modal
  const handleCloseContactModal = () => {
    setShowContactModal(false);
  };

  // Handle reminder when user hovers out
  const handleHoverOut = () => {
    
    const assistant = AIAssistant.getInstance();
    
    const currentTime = Date.now();
    if (currentTime - lastActivationTime.current < debounceTime) {
      console.log('Skipping hover-out reminder - activation was too brief');
      return;
    }
    
    if (assistantActive && !showReminder) {
      setShowReminder(true);
      
      if (reminderTimeoutRef.current) {
        clearTimeout(reminderTimeoutRef.current);
      }
      
      // Speak the reminder
      assistant.speak(assistant.getReminder());
      
      // Hide reminder after 4.5 seconds
      reminderTimeoutRef.current = setTimeout(() => {
        setShowReminder(false);
      }, 4500);
    }
  };

  const handleMouseEnter = () => {
    if (!hasTouchScreen) {
      setIsHovered(true);

      if (!assistantActive) {
        const currentTime = Date.now();
        if (currentTime - lastDeactivationTime.current < debounceTime) {
          console.log('Debouncing activation - too soon after deactivation');
          return;
        }

        const timer = setTimeout(() => {
          setAssistantActive(true);
          lastActivationTime.current = Date.now();
        }, 1200);
        activationTimeout.current = timer;
      }
    }
  };

  const handleMouseLeave = () => {
    if (!hasTouchScreen) {
      setIsHovered(false);
      setTimeout(() => {
        if (!isHovered) {
          const currentTime = Date.now();
          if (assistantActive) {
            if (currentTime - lastActivationTime.current > debounceTime) {
              handleHoverOut();
            }
            deactivateAssistant();
          }
        }
      }, 300);
    }
  };

  const handleTouchStart = () => {
    setIsHovered(prev => !prev);
    
    if (!assistantActive) {
      const timer = setTimeout(() => {
        setAssistantActive(true);
      }, 1000);
      activationTimeout.current = timer;
    } else {
      deactivateAssistant();
    }
  };

  useEffect(() => {
    const updateBatteryStatus = (battery: any) => {
      const level = (battery.level * 100).toFixed(1);
      setBatteryLevel(level);
      setIsCharging(battery.charging);
      
      battery.addEventListener('levelchange', () => {
        setBatteryLevel((battery.level * 100).toFixed(1));
      });
      battery.addEventListener('chargingchange', () => {
        setIsCharging(battery.charging);
      });
    };

    // Check if Battery API is available
    if ('getBattery' in navigator) {
      // @ts-ignore: Browser API not in TypeScript definitions
      navigator.getBattery().then(updateBatteryStatus);
    } else {
      // Fallback if Battery API not available
      setBatteryLevel("87.2");
    }

    // Detect if device has touch capability
    setHasTouchScreen(
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      (navigator as any).msMaxTouchPoints > 0
    );
    
    // Brief animation preview on load for all devices
    setIsHovered(true);
    const timer = setTimeout(() => {
      setIsHovered(false);
    }, 2000);
    
    // Cleanup timeout on unmount
    return () => {
      clearTimeout(timer);
      deactivateAssistant();
    };
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 md:px-20 mt-20 md:mt-40 w-full z-[20]"
    >
      <div className="h-full w-full flex flex-col gap-5 justify-center text-start ml-28">
        <motion.div
          variants={slideInFromTop}
          className="Welcome-box py-[8px] px-[10px] border border-[#7042f88b] opacity-[0.9] rounded-full flex items-center w-fit"
        >
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <h1 className="Welcome-text text-sm md:text-base">
            ABOUT ME
          </h1>
        </motion.div>

        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-6 mt-6 text-4xl sm:text-5xl md:text-6xl font-bold text-white max-w-[600px] w-auto h-auto"
        >
          <span>
          {`hey, I'm `} 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
              {" "}Rishi 
            </span>{" "}
            <span className="inline-block animate-wave">👋</span>
          </span>
        </motion.div>

        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-base md:text-lg text-gray-400 my-5 max-w-[600px]"
        >
          Passionate FullStack Web Developer, pushing the boundaries of web technology to create immersive digital experiences.
        </motion.p>

        <motion.div
          variants={slideInFromLeft(1)}
          className="flex flex-col gap-4 md:mt-4"
        >
          <div className="flex items-center gap-2 text-gray-300">
            <div className="bg-purple-600/20 p-2 rounded-full">
              <SparklesIcon className="h-5 w-5 text-purple-500" />
            </div>
            <span className="text-base">Bridging the Gap Between Design and Development</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-300">
            <div className="bg-cyan-600/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="text-base">Where creativity meets functionality</span>
          </div>
        </motion.div>

        <motion.a
          variants={slideInFromLeft(1.2)}
          href="#projects"
          className="py-2 px-6 button-primary text-center text-white cursor-pointer rounded-lg max-w-[200px] mt-8 flex items-center justify-center group"
        >
          View Projects
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.a>
      </div>

      <motion.div
        variants={slideInFromRight(0.8)}
        className="w-full h-full flex justify-center items-center mt-12 md:mt-0 relative"
      >
        {/* Arc Reactor Container with improved hover detection */}
        <div 
          ref={containerRef}
          className={`arc-reactor-container relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden z-[30] ${isHovered ? 'arc-reactor-active' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          style={{pointerEvents: 'auto'}}
          aria-label="Interactive Arc Reactor - Hover to activate AI assistant"
          role="button"
          tabIndex={0}
        >
          {/* Small hint for users - only visible initially */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 opacity-70 z-[60] pointer-events-none">
            <div className="text-xs text-cyan-300 font-mono px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-cyan-500/20 whitespace-nowrap">
              Hover to activate Arc Reactor AI
            </div>
          </div>
          
          {/* AI Assistant integration - no visible UI, just voice */}
          <ArcReactorAssistant 
            isActive={assistantActive} 
            assistantName="StellarForge" 
            onShowContactForm={handleShowContactModal}
            onHoverOut={handleHoverOut}
          />
          
          {/* Improved hover detection overlay */}
          <div 
            className="absolute inset-0 z-40 opacity-0" 
            style={{pointerEvents: 'auto'}}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          ></div>

          {/* Dark overlay */}
          <div className="arc-overlay absolute inset-0 bg-black/70 opacity-0 z-10"></div>
          
          {/* Arc Reactor Core */}
          <div className="arc-reactor absolute inset-0 flex items-center justify-center opacity-0 z-20">
            <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] rounded-full bg-cyan-500/20 flex items-center justify-center relative">
              {/* Inner Rings */}
              <div className="absolute w-full h-full rounded-full border-4 border-cyan-400/60 animate-pulse"></div>
              <div className="absolute w-[85%] h-[85%] rounded-full border-2 border-cyan-500/80 animate-spin-slow"></div>
              <div className="absolute w-[70%] h-[70%] rounded-full border-4 border-dashed border-blue-500/60 animate-reverse-spin"></div>
              <div className="absolute w-[60%] h-[60%] rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 animate-pulse"></div>
              
              {/* Core Center */}
              <div className="absolute w-[40%] h-[40%] rounded-full bg-white animate-core-pulse z-20 flex items-center justify-center shadow-[0_0_20px_10px_rgba(255,255,255,0.8)]">
                <div className="w-[60%] h-[60%] rounded-full bg-cyan-500 animate-ping-slow"></div>
              </div>
              
              {/* Triangular segments around the core - static implementation */}
              <div className="absolute w-full h-full" style={{ transform: 'rotate(0deg)', clipPath: 'polygon(50% 50%, 54% 0, 46% 0)', background: 'rgba(59, 130, 246, 0.6)' }}></div>
              <div className="absolute w-full h-full" style={{ transform: 'rotate(45deg)', clipPath: 'polygon(50% 50%, 54% 0, 46% 0)', background: 'rgba(14, 165, 233, 0.6)' }}></div>
              <div className="absolute w-full h-full" style={{ transform: 'rotate(90deg)', clipPath: 'polygon(50% 50%, 54% 0, 46% 0)', background: 'rgba(59, 130, 246, 0.6)' }}></div>
              <div className="absolute w-full h-full" style={{ transform: 'rotate(135deg)', clipPath: 'polygon(50% 50%, 54% 0, 46% 0)', background: 'rgba(14, 165, 233, 0.6)' }}></div>
              <div className="absolute w-full h-full" style={{ transform: 'rotate(180deg)', clipPath: 'polygon(50% 50%, 54% 0, 46% 0)', background: 'rgba(59, 130, 246, 0.6)' }}></div>
              <div className="absolute w-full h-full" style={{ transform: 'rotate(225deg)', clipPath: 'polygon(50% 50%, 54% 0, 46% 0)', background: 'rgba(14, 165, 233, 0.6)' }}></div>
              <div className="absolute w-full h-full" style={{ transform: 'rotate(270deg)', clipPath: 'polygon(50% 50%, 54% 0, 46% 0)', background: 'rgba(59, 130, 246, 0.6)' }}></div>
              <div className="absolute w-full h-full" style={{ transform: 'rotate(315deg)', clipPath: 'polygon(50% 50%, 54% 0, 46% 0)', background: 'rgba(14, 165, 233, 0.6)' }}></div>
            </div>
          </div>
          
          {/* Reminder bubble */}
          {showReminder && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-fade-in">
              <div className="px-3 py-2 rounded-lg bg-black/40 backdrop-blur-sm border border-blue-500/30 max-w-[250px]">
                <p className="text-xs text-cyan-100 font-mono text-center">
                  {`If you'd like me to power down, just say 'stop' or another shutdown command.`}
                </p>
              </div>
            </div>
          )}
          
          {/* Tech circuit lines */}
          <div className="circuit-lines absolute inset-0 opacity-0 z-10">
            <div className="circuit-line-1 absolute h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" style={{ top: '50%', left: '50%', width: '50%', transformOrigin: 'left center', transform: 'rotate(0deg)' }}></div>
            <div className="circuit-line-2 absolute h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" style={{ top: '50%', left: '50%', width: '50%', transformOrigin: 'left center', transform: 'rotate(36deg)' }}></div>
            <div className="circuit-line-3 absolute h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" style={{ top: '50%', left: '50%', width: '50%', transformOrigin: 'left center', transform: 'rotate(72deg)' }}></div>
            <div className="circuit-line-4 absolute h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" style={{ top: '50%', left: '50%', width: '50%', transformOrigin: 'left center', transform: 'rotate(108deg)' }}></div>
            <div className="circuit-line-5 absolute h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" style={{ top: '50%', left: '50%', width: '50%', transformOrigin: 'left center', transform: 'rotate(144deg)' }}></div>
            <div className="circuit-line-6 absolute h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" style={{ top: '50%', left: '50%', width: '50%', transformOrigin: 'left center', transform: 'rotate(180deg)' }}></div>
            <div className="circuit-line-7 absolute h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" style={{ top: '50%', left: '50%', width: '50%', transformOrigin: 'left center', transform: 'rotate(216deg)' }}></div>
            <div className="circuit-line-8 absolute h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" style={{ top: '50%', left: '50%', width: '50%', transformOrigin: 'left center', transform: 'rotate(252deg)' }}></div>
            <div className="circuit-line-9 absolute h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" style={{ top: '50%', left: '50%', width: '50%', transformOrigin: 'left center', transform: 'rotate(288deg)' }}></div>
            <div className="circuit-line-10 absolute h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" style={{ top: '50%', left: '50%', width: '50%', transformOrigin: 'left center', transform: 'rotate(324deg)' }}></div>
          </div>
          
          {/* Power level indicators */}
          <div className="power-indicators absolute bottom-5 left-0 right-0 flex justify-center gap-1 opacity-0 z-30">
            <div className="power-bar-1 h-1 w-8 rounded-full bg-cyan-400"></div>
            <div className="power-bar-2 h-1 w-8 rounded-full bg-cyan-400"></div>
            <div className="power-bar-3 h-1 w-8 rounded-full bg-cyan-400"></div>
            <div className="power-bar-4 h-1 w-8 rounded-full bg-cyan-400"></div>
            <div className="power-bar-5 h-1 w-8 rounded-full bg-cyan-400"></div>
          </div>
          
          {/* Enhanced scanlines effect - only visible on hover */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent bg-[length:100%_4px] opacity-0 arc-scanlines z-20"></div>
          
          {/* Text overlay */}
          <div className="arc-text absolute inset-0 flex flex-col items-center justify-center opacity-0 z-20">
            {/* <div className="text-cyan-500 font-mono text-xs tracking-wider mb-2 mt-32 animate-text-flicker">RAWATX INDUSTRIES</div> */}
            <div className="text-white font-bold text-lg mb-2 mt-36 animate-text-flicker-delay">StellarForge</div>
            <div className="text-cyan-400 font-mono text-xs animate-text-flicker-delay2">StellarForge ARC REACTOR ONLINE</div>
          </div>
          
          {/* Diagnostics overlay - only visible on hover */}
          <div className="absolute top-10 left-20 flex flex-col  opacity-0 arc-diagnostics z-30">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
              <div className="text-cyan-400 font-mono text-xs animate-text-flicker">SYSTEM: ACTIVE</div>
            </div>
            <div className="flex items-center mt-1">
              <div className={`h-2 w-2 rounded-full ${isCharging ? 'bg-green-500 animate-ping-slow' : 'bg-green-500 animate-pulse'} mr-1`}></div>
              <div className="text-green-400 font-mono text-xs animate-text-flicker-delay flex items-center">
                POWER: {batteryLevel}%
                {isCharging && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
          
          {/* Base glow effect */}
          <div className="arc-border absolute inset-0 rounded-full border-[3px] border-purple-500/50 z-10"></div>
          
          {/* Image */}
          <Image
            src="/rishi.jpg"
            alt="Rishi - FullStack Developer"
            fill
            className="profile-image object-cover object-center z-0 rounded-full"
            priority
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          
          {/* Tech-themed decorative elements */}
          <div className="tech-icon-1 absolute top-5 -right-4 w-12 h-12 bg-purple-500/20 backdrop-blur-md rounded-full border border-purple-500/50 flex items-center justify-center z-20">
            <span className="text-lg">⚛️</span>
          </div>
          
          <div className="tech-icon-2 absolute bottom-10 -left-6 w-14 h-14 bg-cyan-500/20 backdrop-blur-md rounded-full border border-cyan-500/50 flex items-center justify-center z-20">
            <span className="text-lg">🚀</span>
          </div>
          
          {/* Energy wave rings - appear on hover */}
          <div className="absolute inset-0 pointer-events-none opacity-0 arc-energy-waves z-10">
            <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full scale-0 animate-energy-wave-1"></div>
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full scale-0 animate-energy-wave-2"></div>
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full scale-0 animate-energy-wave-3"></div>
          </div>
        </div>
        
        {/* Decorative tech elements */}
        <div className="absolute w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-cyan-500 rounded-full animate-ping animation-delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-amber-500 rounded-full animate-ping animation-delay-2000"></div>
        </div>
      </motion.div>
      
      {/* Contact Modal */}
      <ContactModal isOpen={showContactModal} onClose={handleCloseContactModal} />
    </motion.div>
  );
};
