
import { ResourceDisplay } from "@/components/ResourceDisplay";
import { CoinButton } from "@/components/CoinButton";
import { AiBuddy } from "@/components/AiBuddy";
import { OnboardingModal } from "@/components/OnboardingModal";
import { useEffect, useState, useRef } from "react";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Zap, Star, Timer, Video } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BoostButton } from "@/components/BoostButton";
import { useToast } from "@/hooks/use-toast";
import { CoinParticlesProvider, useCoinParticles } from "@/components/coin/CoinParticlesContext";
import { sounds, playSound, toggleBackgroundMusic } from "@/utils/audioUtils";

const Index = () => {
  const { gameState, resetEnergy } = useGame();
  const { toast } = useToast();
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(gameState.level);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Set up level change detection
  useEffect(() => {
    if (previousLevel < gameState.level) {
      // Level up detected
      handleLevelUp();
      setPreviousLevel(gameState.level);
    }
  }, [gameState.level, previousLevel]);

  // Animation/sound effects
  useEffect(() => {
    document.title = "TapVerse - Tap, Collect, Earn!";
    
    // Start background music after user interacts
    const handleUserInteraction = () => {
      toggleBackgroundMusic(true);
      document.removeEventListener('click', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      toggleBackgroundMusic(false);
    };
  }, []);

  // Calculate XP percentage for the progress bar
  const xpNeededForNextLevel = 100; // Simplified level formula from GameContext
  const currentLevelXp = gameState.experience % xpNeededForNextLevel;
  const xpPercentage = (currentLevelXp / xpNeededForNextLevel) * 100;
  
  // Handle level up animation
  const handleLevelUp = () => {
    if (window.createLevelUpAnimation) {
      window.createLevelUpAnimation(gameState.level);
    } else {
      // Fallback if the global function isn't available
      // Show toast
      toast({
        title: "Level Up!",
        description: `You've reached level ${gameState.level}!`,
        duration: 4000,
      });
      
      // Create level up animation
      const LevelUpAnimation = () => {
        const { createLevelUpAnimation } = useCoinParticles();
        
        useEffect(() => {
          // Play sound
          if (sounds.perfectSound) {
            try {
              playSound(sounds.perfectSound);
            } catch (err) {
              console.warn("Could not play sound:", err);
            }
          }
          
          createLevelUpAnimation(gameState.level);
        }, []);
        
        return null;
      };
      
      // This would be better implemented using a global animation system,
      // but for this example we're using a component-based approach
      const animRoot = document.createElement('div');
      document.body.appendChild(animRoot);
      
      // Clean up animation root after it's done
      setTimeout(() => {
        document.body.removeChild(animRoot);
      }, 5000);
    }
    
    // Animate progress bar
    if (progressBarRef.current) {
      progressBarRef.current.classList.add('animate-pulse-soft');
      setTimeout(() => {
        progressBarRef.current?.classList.remove('animate-pulse-soft');
      }, 2000);
    }
  };
  
  // Handle energy refill with ad
  const handleEnergyRefill = () => {
    if (isWatchingAd) return;
    
    // Simulate watching an ad
    setIsWatchingAd(true);
    toast({
      title: "Ad Starting",
      description: "Watching ad to refill your energy...",
      duration: 2000, // Auto-dismiss
    });
    
    // Simulate ad completion after 2 seconds
    setTimeout(() => {
      resetEnergy();
      setIsWatchingAd(false);
      
      toast({
        title: "Energy Refilled!",
        description: "Your energy has been fully restored!",
        variant: "default",
        duration: 3000, // Auto-dismiss
      });
      
      // Create celebration animation
      createEnergyRefillAnimation();
      
      // Try to vibrate device
      try {
        if (window.navigator.vibrate) {
          window.navigator.vibrate([30, 50, 30]);
        }
      } catch (err) {
        // Ignore vibration errors
      }
    }, 2000);
  };
  
  // Create energy refill celebration animation
  const createEnergyRefillAnimation = () => {
    // Create element for animation
    const animContainer = document.createElement('div');
    animContainer.className = 'fixed inset-0 pointer-events-none z-50 flex items-center justify-center';
    document.body.appendChild(animContainer);
    
    animContainer.innerHTML = `
      <div class="animate-scale-in text-green-500 font-bold text-4xl opacity-0" 
           style="animation: energyRefill 1.5s forwards;">
        ENERGY REFILLED!
      </div>
    `;
    
    // Add style for the animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes energyRefill {
        0% { transform: scale(0.5); opacity: 0; }
        25% { transform: scale(1.2); opacity: 1; }
        75% { transform: scale(1); opacity: 1; }
        100% { transform: scale(1.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    // Add sparkle effect
    for (let i = 0; i < 20; i++) {
      const spark = document.createElement('div');
      const size = 10 + Math.floor(Math.random() * 20);
      spark.style.position = 'absolute';
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.left = `${10 + Math.random() * 80}%`;
      spark.style.top = `${10 + Math.random() * 80}%`;
      spark.style.opacity = '0';
      
      // Randomize appearance
      if (Math.random() > 0.5) {
        spark.innerText = '✨';
        spark.style.fontSize = `${size}px`;
        spark.style.color = 'rgba(0, 200, 0, 0.8)';
      } else {
        spark.style.background = 'radial-gradient(circle, rgba(0,255,0,0.8) 0%, rgba(0,255,0,0) 70%)';
        spark.style.borderRadius = '50%';
      }
      
      spark.style.animation = `sparkFadeIn 1s forwards ${Math.random() * 0.5}s`;
      animContainer.appendChild(spark);
    }
    
    style.textContent += `
      @keyframes sparkFadeIn {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1); opacity: 1; }
        100% { transform: scale(0.5); opacity: 0; }
      }
    `;
    
    // Clean up after animation
    setTimeout(() => {
      document.body.removeChild(animContainer);
      document.head.removeChild(style);
    }, 2000);
  };

  return (
    <CoinParticlesProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-light-gray py-10 px-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center gradient-text mb-2">
            TapVerse
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Tap to collect coins and unlock rewards!
          </p>

          <ResourceDisplay />

          {/* XP Progress Bar */}
          <div className="mt-6 bg-white p-4 rounded-xl shadow-md border border-purple/10">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-gold mr-2 animate-pulse-soft" />
                <span className="text-sm font-medium">Level {gameState.level}</span>
              </div>
              <span className="text-xs text-gray-500">
                {currentLevelXp}/{xpNeededForNextLevel} XP
              </span>
            </div>
            <div ref={progressBarRef} className="relative">
              <Progress value={xpPercentage} className="h-2.5 rounded-full overflow-hidden" />
              {/* Glowing dot at current position */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-purple animate-pulse-soft shadow-lg"
                style={{ 
                  left: `${xpPercentage}%`, 
                  transform: 'translateY(-50%) translateX(-50%)',
                  boxShadow: '0 0 8px 2px rgba(155, 135, 245, 0.6)'
                }}
              ></div>
            </div>
          </div>

          {/* Tap Streak Meter */}
          <div className="mt-4 bg-white p-4 rounded-xl shadow-md border border-purple/10">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Timer className="h-5 w-5 text-orange-500 mr-2" />
                <span className="text-sm font-medium">Daily Streak</span>
              </div>
              <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                {gameState.streakDays} days
              </div>
            </div>
            <div className="flex justify-between mt-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div 
                  key={day} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs
                    ${day <= gameState.streakDays 
                      ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white animate-pulse-soft' 
                      : 'bg-gray-100 text-gray-400'}`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Boost Buttons */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <BoostButton 
              icon={Zap} 
              label="Power Tap"
              type="power"
              duration={30}
            />
            <BoostButton 
              icon={Star} 
              label="Double Coins"
              type="double"
              duration={60}
            />
            <BoostButton 
              icon={Timer} 
              label="Auto-Tap"
              type="auto"
              duration={45}
            />
          </div>

          <div className="mt-6 mb-5">
            <CoinButton />
          </div>

          {/* Current stats */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600">
              {gameState.energy > 0 ? (
                <>
                  You earn <span className="font-bold text-purple">{gameState.tapPower.toFixed(1)}</span> coin
                  {gameState.tapPower !== 1 && "s"} per tap
                </>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-red-500 font-medium">Out of energy!</span>
                  <Button 
                    onClick={handleEnergyRefill} 
                    size="sm" 
                    variant="outline" 
                    className={`flex items-center space-x-2 rounded-full ${isWatchingAd ? 'animate-pulse' : ''}`}
                    disabled={isWatchingAd}
                  >
                    <Video className="h-4 w-4" />
                    <span>{isWatchingAd ? 'Watching Ad...' : 'Watch Ad to Refill'}</span>
                  </Button>
                </div>
              )}
            </p>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-4 mb-20">
            <div className="bg-white p-4 rounded-xl shadow-md border border-purple/10 hover:border-purple/30 transition-colors">
              <h3 className="font-semibold mb-1 text-sm">Power Up!</h3>
              <p className="text-xs text-gray-600">
                Visit the shop to upgrade your tapping abilities!
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md border border-purple/10 hover:border-purple/30 transition-colors">
              <h3 className="font-semibold mb-1 text-sm">Settings Tip</h3>
              <p className="text-xs text-gray-600">
                Check profile settings to enable rhythm mode for bonus coins!
              </p>
            </div>
          </div>
        </div>

        <div className="fixed bottom-20 right-4 z-10">
          <AiBuddy />
        </div>
        <OnboardingModal />
      </div>
    </CoinParticlesProvider>
  );
};

export default Index;
