"use client";

import { useEffect, useState, useRef } from "react";
import AIAssistant from "@/lib/ai-assistant";

interface ArcReactorAssistantProps {
  isActive: boolean;
  assistantName?: string;
  onShowContactForm?: () => void;
  onHoverOut?: () => void;
}

export const ArcReactorAssistant = ({
  isActive,
  assistantName = "StellarForge",
  onShowContactForm,
  onHoverOut,
}: ArcReactorAssistantProps) => {
  const [assistant] = useState(() => AIAssistant.getInstance());
  const isFirstRender = useRef(true);
  const [isListening, setIsListening] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const wasActiveRef = useRef(false);
  const lastSpeakTime = useRef<number>(-30000); // Start with a negative time to avoid issues on initial load
  const speakDebounceTime = 3000; // 3 seconds between speaking events

  // Set assistant name and register callbacks
  useEffect(() => {
    assistant.setAssistantName(assistantName);

    // Register callback for when speech ends
    assistant.onSpeechEnd(() => {
      // Update status when speech ends and listening begins
      if (isActive) {
        setStatusMessage("Listening...");
        setShowStatus(true);
        setIsListening(true);
      }
    });

    // Register callback for when user responds
    assistant.onUserResponse((response) => {
      setIsListening(false);
      setStatusMessage(`Processing: "${response.substring(0, 30)}${response.length > 30 ? '...' : ''}"`);
      // Hide status after processing
      setTimeout(() => {
        setShowStatus(false);
      }, 1500);
    });

    // Register contact form callback
    if (onShowContactForm) {
      assistant.setContactFormCallback(onShowContactForm);
    }

    return () => {
      // Cleanup
      assistant.cancel();
    };
  }, [assistant, assistantName, isActive, onShowContactForm]);

  // Update the assistant's active state when isActive changes
  useEffect(() => {
    // When active state changes, inform the assistant
    assistant.setActive(isActive);
    
    // Skip initial render to prevent speaking on page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isActive) {
      const currentTime = Date.now();
      // Only speak if sufficient time has passed since last speaking
      if (currentTime - lastSpeakTime.current > speakDebounceTime) {
        const greeting = assistant.getGreeting();
        assistant.speak(greeting);
        setStatusMessage("Speaking...");
        setShowStatus(true);
        lastSpeakTime.current = currentTime;
      } else {
        console.log('Debouncing speech - too soon after last speech');
      }
      wasActiveRef.current = true;
    } else if (wasActiveRef.current) {
      // When deactivated after being active, remind about shutdown commands
      if (onHoverOut) {
        const currentTime = Date.now();
        // Only call hover out if sufficient time has passed
        if (currentTime - lastSpeakTime.current > speakDebounceTime) {
          onHoverOut();
          lastSpeakTime.current = currentTime;
        }
      }
      
      // Cancel speech when deactivated
      assistant.cancel();
      setShowStatus(false);
      setIsListening(false);
    }
  }, [isActive, assistant, onHoverOut]);

  // Return null if not active
  if (!isActive) return null;

  return (
    <>
      {/* Minimal UI that only shows status indicator */}
      {showStatus && (
        <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
          <div className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm flex items-center gap-2 border border-cyan-500/30">
            {isListening ? (
              // Pulsing microphone icon when listening
              <div className="relative w-3 h-3">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping-slow opacity-70"></div>
                <div className="absolute inset-0.5 bg-red-500 rounded-full"></div>
              </div>
            ) : (
              // Speaker icon when speaking
              <div className="relative w-3 h-3">
                <div className="absolute inset-0 bg-cyan-500 rounded-full animate-pulse opacity-70"></div>
                <div className="absolute inset-0.5 bg-cyan-500 rounded-full"></div>
              </div>
            )}
            <span className="text-xs text-cyan-100 font-mono">{statusMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ArcReactorAssistant; 