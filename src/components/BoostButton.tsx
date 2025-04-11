
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { useToast } from "@/hooks/use-toast";
import { LucideIcon } from "lucide-react";

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
      
      // Notify user that boost has expired
      toast({
        title: `${label} Expired`,
        description: "Your boost has ended. Activate it again!",
        variant: "default",
      });
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft, label, toast]);

  const handleBoostClick = () => {
    if (isActive || isWatchingAd) return;
    
    // Simulate watching an ad
    setIsWatchingAd(true);
    toast({
      title: "Ad Starting",
      description: "Watching ad to activate your boost...",
    });
    
    // Simulate ad completion after 2 seconds
    setTimeout(() => {
      setIsWatchingAd(false);
      // Apply the boost effect
      applyBoost(type, duration);
      
      toast({
        title: `${label} Activated!`,
        description: `${label} will be active for ${duration} seconds!`,
        variant: "default",
      });
      
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
        100% { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    // Clean up after animation
    setTimeout(() => {
      document.body.removeChild(animContainer);
      document.head.removeChild(style);
    }, 2000);
  };

  return (
    <Button 
      variant="outline" 
      className={`flex flex-col items-center justify-center h-16 relative overflow-hidden 
        ${isWatchingAd ? 'animate-pulse' : ''}
        ${isActive ? 
          type === 'power' ? 'bg-purple/10 border-purple' : 
          type === 'double' ? 'bg-gold/10 border-gold' : 
          'bg-teal/10 border-teal' : 
          'border-purple/20 hover:bg-purple/5'
        }`}
      onClick={handleBoostClick}
      disabled={isActive || isWatchingAd}
    >
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r opacity-20"
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
        <div 
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all"
          style={{
            width: `${(timeLeft / duration) * 100}%`,
            background: type === 'power' ? 'linear-gradient(to right, #9b87f5, #6b46c1)' :
                       type === 'double' ? 'linear-gradient(to right, #ffd700, #ffa500)' :
                       'linear-gradient(to right, #4fd1c5, #38b2ac)'
          }}
        />
      )}
    </Button>
  );
}
