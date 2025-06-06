"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";

import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/lib/motion";
import ContactModal from "./contact-modal";
import AIAssistant from "@/lib/ai-assistant";

export const HeroContent = () => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasTouchScreen, setHasTouchScreen] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState("--.-");
  const [isCharging, setIsCharging] = useState(false);
  const [assistantActive, setAssistantActive] = useState(false);
  const [hasSpokenOnce, setHasSpokenOnce] = useState(false);
  const activationTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const reminderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivationTime = useRef<number>(-30000);
  const lastDeactivationTime = useRef<number>(-30000);
  const debounceTime = 3000;
  const assistantRef = useRef<any>(null);

  // Initialize AI Assistant
  useEffect(() => {
    assistantRef.current = AIAssistant.getInstance();
  }, []);

  // Track mouse position for dynamic cursor glow
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      containerRef.current.style.setProperty('--cursor-x', `${x}%`);
      containerRef.current.style.setProperty('--cursor-y', `${y}%`);
    }
  }, []);

  // Helper function to cleanly deactivate the assistant
  const deactivateAssistant = useCallback(() => {
    // Cancel any pending activation
    if (activationTimeout.current) {
      clearTimeout(activationTimeout.current);
      activationTimeout.current = null;
    }
    
    // Get assistant and cancel any ongoing speech/recognition
    if (assistantRef.current) {
      assistantRef.current.cancel();
    }
    
    // Update states
    setAssistantActive(false);
    lastDeactivationTime.current = Date.now();
    
    // Clear any ongoing reminder
    if (reminderTimeoutRef.current) {
      clearTimeout(reminderTimeoutRef.current);
      setShowReminder(false);
    }
  }, []);

  // Handle showing contact modal
  const handleShowContactModal = useCallback(() => {
    setShowContactModal(true);
  }, []);

  // Handle closing contact modal
  const handleCloseContactModal = useCallback(() => {
    setShowContactModal(false);
  }, []);

  // Handle reminder when user hovers out
  const handleHoverOut = useCallback(() => {
    const currentTime = Date.now();
    if (currentTime - lastActivationTime.current < debounceTime) {
      console.log('Skipping hover-out reminder - activation was too brief');
      return;
    }
    
    if (assistantActive && !showReminder && assistantRef.current) {
      setShowReminder(true);
      
      if (reminderTimeoutRef.current) {
        clearTimeout(reminderTimeoutRef.current);
      }
      
      // Speak the reminder only if assistant hasn't spoken yet
      if (!hasSpokenOnce) {
        assistantRef.current.speak(assistantRef.current.getReminder());
        setHasSpokenOnce(true);
      }
      
      // Hide reminder after 4.5 seconds
      reminderTimeoutRef.current = setTimeout(() => {
        setShowReminder(false);
      }, 4500);
    }
  }, [assistantActive, showReminder, hasSpokenOnce]);

  const handleMouseEnter = useCallback(() => {
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
          
          // Speak welcome message only once per session
          if (!hasSpokenOnce && assistantRef.current) {
            assistantRef.current.speak("Welcome! I'm StellarForge AI Assistant. How can I help you today?");
            setHasSpokenOnce(true);
          }
        }, 1200);
        activationTimeout.current = timer;
      }
    }
  }, [hasTouchScreen, assistantActive, hasSpokenOnce]);

  const handleMouseLeave = useCallback(() => {
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
  }, [hasTouchScreen, isHovered, assistantActive, handleHoverOut, deactivateAssistant]);

  const handleTouchStart = useCallback(() => {
    setIsHovered(prev => !prev);
    
    if (!assistantActive) {
      const timer = setTimeout(() => {
        setAssistantActive(true);
        lastActivationTime.current = Date.now();
        
        // Speak welcome message only once per session
        if (!hasSpokenOnce && assistantRef.current) {
          assistantRef.current.speak("Welcome! I'm StellarForge AI Assistant. How can I help you today?");
          setHasSpokenOnce(true);
        }
      }, 1000);
      activationTimeout.current = timer;
    } else {
      deactivateAssistant();
    }
  }, [assistantActive, hasSpokenOnce, deactivateAssistant]);

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
  }, [deactivateAssistant]);

  return (
    <>
      {/* Custom CSS Styles */}
      <style jsx>{`
        .arc-reactor-container {
          position: relative;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          --cursor-x: 50%;
          --cursor-y: 50%;
        }

        .arc-reactor-container::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: conic-gradient(from 180deg at var(--cursor-x) var(--cursor-y), 
            transparent, 
            rgba(6, 182, 212, 0.4), 
            rgba(147, 51, 234, 0.4), 
            transparent);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .arc-reactor-container:hover::before,
        .arc-reactor-container.arc-reactor-active::before {
          opacity: 1;
        }

        .arc-reactor-container.arc-reactor-active .arc-overlay {
          opacity: 1;
        }

        .arc-reactor-container.arc-reactor-active .arc-reactor {
          opacity: 1;
        }

        .arc-reactor-container.arc-reactor-active .circuit-lines {
          opacity: 0.8;
        }

        .arc-reactor-container.arc-reactor-active .power-indicators {
          opacity: 1;
        }

        .arc-reactor-container.arc-reactor-active .arc-scanlines {
          opacity: 1;
          animation: scanlines 2s linear infinite;
        }

        .arc-reactor-container.arc-reactor-active .arc-text {
          opacity: 1;
        }

        .arc-reactor-container.arc-reactor-active .arc-diagnostics {
          opacity: 1;
        }

        .arc-reactor-container.arc-reactor-active .arc-border {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.6), 
                      0 0 40px rgba(6, 182, 212, 0.4),
                      inset 0 0 20px rgba(255, 255, 255, 0.1);
          border-color: rgba(147, 51, 234, 0.8);
        }

        .arc-reactor-container.arc-reactor-active .arc-energy-waves {
          opacity: 1;
        }

        .arc-reactor-container.arc-reactor-active .tech-icon-1,
        .arc-reactor-container.arc-reactor-active .tech-icon-2 {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(147, 51, 234, 0.5);
        }

        @keyframes scanlines {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes core-pulse {
          0%, 100% { 
            box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.8);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 30px 15px rgba(255, 255, 255, 1);
            transform: scale(1.05);
          }
        }

        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }

        @keyframes text-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes text-flicker-delay {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }

        @keyframes text-flicker-delay2 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes energy-wave-1 {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        @keyframes energy-wave-2 {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }

        @keyframes energy-wave-3 {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-wave {
          animation: wave 0.6s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-reverse-spin {
          animation: reverse-spin 2s linear infinite;
        }

        .animate-core-pulse {
          animation: core-pulse 2s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-text-flicker {
          animation: text-flicker 2s ease-in-out infinite;
        }

        .animate-text-flicker-delay {
          animation: text-flicker-delay 2.5s ease-in-out infinite;
        }

        .animate-text-flicker-delay2 {
          animation: text-flicker-delay2 3s ease-in-out infinite;
        }

        .animate-energy-wave-1 {
          animation: energy-wave-1 2s ease-out infinite;
        }

        .animate-energy-wave-2 {
          animation: energy-wave-2 2s ease-out infinite 0.3s;
        }

        .animate-energy-wave-3 {
          animation: energy-wave-3 2s ease-out infinite 0.6s;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .button-primary {
          background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(124, 58, 237, 0.3);
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);
        }

        .button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
          background: linear-gradient(135deg, #8b5cf6 0%, #0891b2 100%);
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .arc-reactor-container {
            width: 250px !important;
            height: 250px !important;
          }
          
          .arc-diagnostics {
            left: 10px !important;
            top: 5px !important;
          }
          
          .tech-icon-1 {
            top: 10px !important;
            right: -10px !important;
            width: 40px !important;
            height: 40px !important;
          }
          
          .tech-icon-2 {
            bottom: 20px !important;
            left: -10px !important;
            width: 40px !important;
            height: 40px !important;
          }
        }

        @media (max-width: 768px) {
          .arc-reactor-container {
            width: 300px !important;
            height: 300px !important;
          }
        }

        @media (min-width: 1024px) {
          .arc-reactor-container {
            width: 450px !important;
            height: 450px !important;
          }
        }
      `}</style>

      <motion.div
        initial="hidden"
        animate="visible"
        className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 mt-10 sm:mt-16 md:mt-20 lg:mt-40 w-full z-[20] gap-8 lg:gap-12"
      >
        {/* Left Content Section */}
        <div className="h-full w-full flex flex-col gap-3 sm:gap-4 md:gap-5 justify-center text-center lg:text-start lg:ml-28 order-2 lg:order-1">
          <motion.div
            variants={slideInFromTop}
            className="Welcome-box py-[6px] sm:py-[8px] px-[8px] sm:px-[10px] border border-[#7042f88b] opacity-[0.9] rounded-full flex items-center w-fit mx-auto lg:mx-0"
          >
            <SparklesIcon className="text-[#b49bff] mr-[8px] sm:mr-[10px] h-4 w-4 sm:h-5 sm:w-5" />
            <h1 className="Welcome-text text-xs sm:text-sm md:text-base">
              ABOUT ME
            </h1>
          </motion.div>

          <motion.div
            variants={slideInFromLeft(0.5)}
            className="flex flex-col gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-5 md:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white max-w-full lg:max-w-[600px] w-auto h-auto"
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
            className="text-sm sm:text-base md:text-lg text-gray-400 my-3 sm:my-4 md:my-5 max-w-full lg:max-w-[600px] px-4 lg:px-0"
          >
            Passionate FullStack Web Developer, pushing the boundaries of web technology to create immersive digital experiences.
          </motion.p>

          <motion.div
            variants={slideInFromLeft(1)}
            className="flex flex-col gap-3 sm:gap-4 md:mt-4 px-4 lg:px-0"
          >
            <div className="flex items-center gap-2 sm:gap-3 text-gray-300 justify-center lg:justify-start">
              <div className="bg-purple-600/20 p-2 rounded-full">
                <SparklesIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              </div>
              <span className="text-sm sm:text-base">Bridging the Gap Between Design and Development</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 text-gray-300 justify-center lg:justify-start">
              <div className="bg-cyan-600/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span className="text-sm sm:text-base">Where creativity meets functionality</span>
            </div>
          </motion.div>

          {/* <motion.a
            variants={slideInFromLeft(1.2)}
            href="#projects"
            className="py-2 sm:py-3 px-4 sm:px-6 button-primary text-center text-white cursor-pointer rounded-lg max-w-[180px] sm:max-w-[200px] mt-6 sm:mt-8 flex items-center justify-center group mx-auto lg:mx-0"
          >
            <span className="text-sm sm:text-base">View Projects</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.a> */}
        </div>

        {/* Right Arc Reactor Section */}
        <motion.div
          variants={slideInFromRight(0.8)}
          className="w-full h-full flex justify-center items-center mt-8 sm:mt-10 md:mt-12 lg:mt-0 relative order-1 lg:order-2"
        >
          {/* Arc Reactor Container with improved hover detection */}
          <div 
            ref={containerRef}
            className={`arc-reactor-container relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden z-[30] ${isHovered ? 'arc-reactor-active' : ''}`}
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
            <div className="absolute top-2 sm:top-3 left-1/2 transform -translate-x-1/2 opacity-70 z-[60] pointer-events-none">
              <div className="text-[10px] sm:text-xs text-cyan-300 font-mono px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-cyan-500/20 whitespace-nowrap">
                <span className="hidden sm:inline">Hover to activate Arc Reactor AI</span>
                <span className="sm:hidden">Tap to activate AI</span>
              </div>
            </div>
            
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
              <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] lg:w-[150px] lg:h-[150px] rounded-full bg-cyan-500/20 flex items-center justify-center relative">
                {/* Inner Rings */}
                <div className="absolute w-full h-full rounded-full border-2 sm:border-4 border-cyan-400/60 animate-pulse"></div>
                <div className="absolute w-[85%] h-[85%] rounded-full border border-cyan-500/80 sm:border-2 animate-spin-slow"></div>
                <div className="absolute w-[70%] h-[70%] rounded-full border-2 sm:border-4 border-dashed border-blue-500/60 animate-reverse-spin"></div>
                <div className="absolute w-[60%] h-[60%] rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 animate-pulse"></div>
                
                {/* Core Center */}
                <div className="absolute w-[40%] h-[40%] rounded-full bg-white animate-core-pulse z-20 flex items-center justify-center shadow-[0_0_15px_8px_rgba(255,255,255,0.8)] sm:shadow-[0_0_20px_10px_rgba(255,255,255,0.8)]">
                  <div className="w-[60%] h-[60%] rounded-full bg-cyan-500 animate-ping-slow"></div>
                </div>
                
                {/* Triangular segments around the core */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation, index) => (
                  <div 
                    key={index}
                    className="absolute w-full h-full" 
                    style={{ 
                      transform: `rotate(${rotation}deg)`, 
                      clipPath: 'polygon(50% 50%, 54% 0, 46% 0)', 
                      background: index % 2 === 0 ? 'rgba(59, 130, 246, 0.6)' : 'rgba(14, 165, 233, 0.6)' 
                    }}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Reminder bubble */}
            {showReminder && (
              <div className="absolute top-8 sm:top-10 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-fade-in">
                <div className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-black/40 backdrop-blur-sm border border-blue-500/30 max-w-[200px] sm:max-w-[250px]">
                  <p className="text-[10px] sm:text-xs text-cyan-100 font-mono text-center">
                    {`If you'd like me to power down, just say 'stop' or another shutdown command.`}
                  </p>
                </div>
              </div>
            )}
            
            {/* Tech circuit lines */}
            <div className="circuit-lines absolute inset-0 opacity-0 z-10">
              {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((rotation, index) => (
                <div 
                  key={index}
                  className={`circuit-line-${index + 1} absolute h-0.5 bg-gradient-to-r from-cyan-500 to-transparent`} 
                  style={{ 
                    top: '50%', 
                    left: '50%', 
                    width: '50%', 
                    transformOrigin: 'left center', 
                    transform: `rotate(${rotation}deg)` 
                  }}
                ></div>
              ))}
            </div>
            
            {/* Power level indicators */}
            <div className="power-indicators absolute bottom-3 sm:bottom-5 left-0 right-0 flex justify-center gap-1 opacity-0 z-30">
              {[1, 2, 3, 4, 5].map((bar) => (
                <div key={bar} className={`power-bar-${bar} h-0.5 sm:h-1 w-6 sm:w-8 rounded-full bg-cyan-400`}></div>
              ))}
            </div>
            
            {/* Enhanced scanlines effect - only visible on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent bg-[length:100%_4px] opacity-0 arc-scanlines z-20"></div>
            
            {/* Text overlay */}
            <div className="arc-text absolute inset-0 flex flex-col items-center justify-center opacity-0 z-20">
              <div className="text-white font-bold text-sm sm:text-lg mb-1 sm:mb-2 mt-24 sm:mt-28 md:mt-32 lg:mt-36 animate-text-flicker-delay">Rishi Rawat</div>
              <div className="text-cyan-400 font-mono text-[10px] sm:text-xs animate-text-flicker-delay2">PORTFOLIO ARC REACTOR ONLINE</div>
            </div>
            
            {/* Diagnostics overlay - only visible on hover */}
            <div className="absolute top-6 sm:top-8 md:top-10 left-4 sm:left-8 md:left-12 lg:left-20 flex flex-col opacity-0 arc-diagnostics z-30">
              <div className="flex items-center">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
                <div className="text-cyan-400 font-mono text-[9px] sm:text-xs animate-text-flicker">SYSTEM: ACTIVE</div>
              </div>
              <div className="flex items-center mt-1">
                <div className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${isCharging ? 'bg-green-500 animate-ping-slow' : 'bg-green-500 animate-pulse'} mr-1`}></div>
                <div className="text-green-400 font-mono text-[9px] sm:text-xs animate-text-flicker-delay flex items-center">
                  POWER: {batteryLevel}%
                  {isCharging && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 sm:h-3 sm:w-3 ml-1 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            
            {/* Base glow effect */}
            <div className="arc-border absolute inset-0 rounded-full border-2 sm:border-[3px] border-purple-500/50 z-10"></div>
            
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
            <div className="tech-icon-1 absolute top-3 sm:top-5 -right-2 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 backdrop-blur-md rounded-full border border-purple-500/50 flex items-center justify-center z-20 transition-all duration-300">
              <span className="text-sm sm:text-lg">⚛️</span>
            </div>
            
            <div className="tech-icon-2 absolute bottom-8 sm:bottom-10 -left-3 sm:-left-6 w-12 h-12 sm:w-14 sm:h-14 bg-cyan-500/20 backdrop-blur-md rounded-full border border-cyan-500/50 flex items-center justify-center z-20 transition-all duration-300">
              <span className="text-sm sm:text-lg">🚀</span>
            </div>
            
            {/* Energy wave rings - appear on hover */}
            <div className="absolute inset-0 pointer-events-none opacity-0 arc-energy-waves z-10">
              <div className="absolute inset-0 border-2 sm:border-4 border-cyan-500/20 rounded-full scale-0 animate-energy-wave-1"></div>
              <div className="absolute inset-0 border-2 sm:border-4 border-blue-500/20 rounded-full scale-0 animate-energy-wave-2"></div>
              <div className="absolute inset-0 border-2 sm:border-4 border-purple-500/20 rounded-full scale-0 animate-energy-wave-3"></div>
            </div>
          </div>
          
          {/* Decorative tech elements */}
          <div className="absolute w-full h-full pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500 rounded-full animate-ping animation-delay-1000"></div>
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full animate-ping animation-delay-2000"></div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Contact Modal */}
      <ContactModal isOpen={showContactModal} onClose={handleCloseContactModal} />
    </>
  );
};