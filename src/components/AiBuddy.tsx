
import { useState, useEffect, useRef } from "react";
import { useGame } from "../contexts/GameContext";
import { MessageSquare } from "lucide-react";

export function AiBuddy() {
  const { aiName, currentBuddyMessage, showNewMessage } = useGame();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const messageTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Show AI buddy when message arrives
  useEffect(() => {
    if (currentBuddyMessage) {
      setIsVisible(true);
      setIsAnimating(true);
      
      // Hide after some time
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => setIsVisible(false), 500);
      }, 4000);
    }
    
    return () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, [currentBuddyMessage]);

  const handleBuddyClick = () => {
    showNewMessage();
  };

  if (!isVisible && !currentBuddyMessage) return null;

  return (
    <div className="fixed bottom-20 right-6 z-40 md:right-10 md:bottom-10">
      <div className={`transition-all duration-500 transform ${isAnimating ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-10 opacity-0'}`}>
        {/* Message bubble */}
        {currentBuddyMessage && (
          <div className="mb-2 p-3 bg-white rounded-lg shadow-lg border border-purple/20 max-w-xs">
            <p className="text-sm">{currentBuddyMessage.message}</p>
          </div>
        )}
        
        {/* AI buddy avatar - fixed position with pointer events only on the avatar */}
        <div 
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple to-blue-400 
                   shadow-lg border-2 border-white flex items-center justify-center
                   cursor-pointer hover:brightness-105 active:scale-95 transition-all duration-200"
          onClick={handleBuddyClick}
        >
          <div className="text-white font-bold text-lg">{aiName.charAt(0)}</div>
        </div>
      </div>
    </div>
  );
}
