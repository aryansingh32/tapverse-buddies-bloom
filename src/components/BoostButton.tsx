
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { useToast } from "@/hooks/use-toast";
import { LucideIcon } from "lucide-react";
import { sounds, playSound } from "@/utils/audioUtils";

interface BoostButtonProps {
  icon: LucideIcon;
  label: string;
  type: 'power' | 'double' | 'auto';
  duration: number; // Duration in seconds
}

export function BoostButton({ icon: Icon, label, type, duration }: BoostButtonProps) {
  const { gameState, applyBoost } = useGame();
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  // Check if boost is active based on game state
  useEffect(() => {
    if (type === 'power' && gameState.powerBoostActive) {
      setIsActive(true);
      const remaining = Math.max(0, Math.floor((gameState.powerBoostEndTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    } else if (type === 'double' && gameState.doubleCoinsActive) {
      setIsActive(true);
      const remaining = Math.max(0, Math.floor((gameState.doubleCoinsEndTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    } else if (type === 'auto' && gameState.autoTapActive) {
      setIsActive(true);
      const remaining = Math.max(0, Math.floor((gameState.autoTapEndTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    } else {
      setIsActive(false);
      setTimeLeft(0);
    }
  }, [
    gameState.powerBoostActive, 
    gameState.doubleCoinsActive, 
    gameState.autoTapActive,
    gameState.powerBoostEndTime,
    gameState.doubleCoinsEndTime,
    gameState.autoTapEndTime,
    type
  ]);

  // Update timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      
      // Notify user that boost has expired with auto-dismissing toast
      toast({
        title: `${label} Expired`,
        description: "Your boost has ended. Activate it again!",
        duration: 3000, // Auto-dismiss after 3 seconds
      });
      
      // Play expiration sound
      try {
        if (sounds.tapSound) {
          sounds.tapSound.playbackRate = 0.7; // Slower pitch for expiration
          playSound(sounds.tapSound);
          sounds.tapSound.playbackRate = 1.0; // Reset
        }
      } catch (err) {
        // Ignore sound errors
      }
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft, label, toast]);

  const handleBoostClick = () => {
    if (isActive || isWatchingAd) return;
    
    // Button press visual effect
    setIsButtonPressed(true);
    setTimeout(() => setIsButtonPressed(false), 150);
    
    // Try to vibrate device
    try {
      if (window.navigator.vibrate) {
        window.navigator.vibrate(20);
      }
    } catch (err) {
      // Ignore vibration errors
    }
    
    // Simulate watching an ad
    setIsWatchingAd(true);
    toast({
      title: "Ad Starting",
      description: "Watching ad to activate your boost...",
      duration: 2000, // Auto-dismiss after 2 seconds
    });
    
    // Simulate ad completion after 2 seconds
    setTimeout(() => {
      setIsWatchingAd(false);
      // Apply the boost effect
      applyBoost(type, duration);
      
      // Auto-dismissing toast for activation
      toast({
        title: `${label} Activated!`,
        description: `${label} will be active for ${duration} seconds!`,
        duration: 3000, // Auto-dismiss after 3 seconds
      });
      
      // Play activation sound
      try {
        if (sounds.perfectSound) {
          playSound(sounds.perfectSound);
        }
      } catch (err) {
        // Ignore sound errors
      }
      
      // Create a celebratory animation
      createBoostAnimation(type);
    }, 2000);
  };

  // Create a celebration animation when boost is activated
  const createBoostAnimation = (boostType: string) => {
    // Create element for animation
    const animContainer = document.createElement('div');
    animContainer.className = 'fixed inset-0 pointer-events-none z-50 flex items-center justify-center';
    document.body.appendChild(animContainer);
    
    // Different animations based on boost type
    const boostClass = boostType === 'power' ? 'text-purple' : 
                      boostType === 'double' ? 'text-gold' : 
                      'text-teal';
    
    animContainer.innerHTML = `
      <div class="animate-scale-in ${boostClass} font-bold text-4xl opacity-0" 
           style="animation: scaleAndFade 1s forwards;">
        ${label} ACTIVATED!
      </div>
    `;
    
    // Add style for the animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scaleAndFade {
        0% { transform: scale(0.5); opacity: 0; }
        50% { transform: scale(1.2); opacity: 1; }
        90% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    // Create star burst effect
    for (let i = 0; i < 12; i++) {
      const star = document.createElement('div');
      const size = 10 + Math.random() * 10;
      const angle = (i / 12) * Math.PI * 2;
      const distance = 50 + Math.random() * 100;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      star.style.position = 'absolute';
      star.style.left = '50%';
      star.style.top = '50%';
      star.style.fontSize = `${size}px`;
      star.style.color = boostType === 'power' ? '#9b87f5' : 
                         boostType === 'double' ? '#ffd700' : 
                         '#4fd1c5';
      star.innerHTML = '★';
      star.style.transform = 'translate(-50%, -50%)';
      star.style.animation = `starBurst 1s forwards`;
      star.style.animationDelay = `${i * 0.05}s`;
      
      animContainer.appendChild(star);
    }
    
    // Add star burst keyframes
    style.textContent += `
      @keyframes starBurst {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
        100% { transform: translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1); opacity: 0; }
      }
    `;
    
    // Clean up after animation
    setTimeout(() => {
      document.body.removeChild(animContainer);
      document.head.removeChild(style);
    }, 2000);
  };

  return (
    <Button 
      variant="outline" 
      className={`flex flex-col items-center justify-center h-16 relative overflow-hidden rounded-xl
        ${isButtonPressed ? 'scale-95' : ''}
        ${isWatchingAd ? 'animate-pulse' : ''}
        ${isActive ? 
          type === 'power' ? 'bg-purple/10 border-purple' : 
          type === 'double' ? 'bg-gold/10 border-gold' : 
          'bg-teal/10 border-teal' : 
          'border-purple/20 hover:bg-purple/5'
        }`}
      onClick={handleBoostClick}
      onMouseDown={() => setIsButtonPressed(true)}
      onMouseUp={() => setIsButtonPressed(false)}
      onMouseLeave={() => setIsButtonPressed(false)}
      disabled={isActive || isWatchingAd}
    >
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r opacity-20 rounded-xl"
             style={{
                background: type === 'power' ? 'linear-gradient(45deg, #9b87f5, #6b46c1)' :
                           type === 'double' ? 'linear-gradient(45deg, #ffd700, #ffa500)' :
                           'linear-gradient(45deg, #4fd1c5, #38b2ac)'
             }}
        />
      )}
      
      <Icon className={`h-5 w-5 ${
        type === 'power' ? 'text-purple' : 
        type === 'double' ? 'text-gold' : 
        'text-teal'
      } mb-1 ${isActive ? 'animate-bounce' : ''}`} />
      
      <span className="text-xs relative z-10">
        {isWatchingAd ? 'Loading...' : isActive ? `${timeLeft}s` : label}
      </span>
      
      {isActive && (
        <>
          {/* Progress bar */}
          <div 
            className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r transition-all rounded-b-xl"
            style={{
              width: `${(timeLeft / duration) * 100}%`,
              background: type === 'power' ? 'linear-gradient(to right, #9b87f5, #6b46c1)' :
                         type === 'double' ? 'linear-gradient(to right, #ffd700, #ffa500)' :
                         'linear-gradient(to right, #4fd1c5, #38b2ac)'
            }}
          />
          
          {/* Glow animation for active boosts */}
          <div 
            className="absolute inset-0 opacity-0 rounded-xl"
            style={{
              animation: 'pulse-glow 2s infinite',
              boxShadow: `0 0 15px 5px ${
                type === 'power' ? 'rgba(155, 135, 245, 0.3)' :
                type === 'double' ? 'rgba(255, 215, 0, 0.3)' :
                'rgba(79, 209, 197, 0.3)'
              }`,
            }}
          />
        </>
      )}
    </Button>
  );
}
