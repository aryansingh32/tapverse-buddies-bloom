
import { ResourceDisplay } from "@/components/ResourceDisplay";
import { CoinButton } from "@/components/CoinButton";
import { AiBuddy } from "@/components/AiBuddy";
import { OnboardingModal } from "@/components/OnboardingModal";
import { useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Zap, Star, Timer, Video } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BoostButton } from "@/components/BoostButton";
import { useToast } from "@/hooks/use-toast";
import { CoinParticlesProvider } from "@/components/coin/CoinParticlesContext";

const Index = () => {
  const { gameState, resetEnergy } = useGame();
  const { toast } = useToast();
  const [isWatchingAd, setIsWatchingAd] = useState(false);

  // Animation/sound effects
  useEffect(() => {
    document.title = "TapVerse - Tap, Collect, Earn!";
  }, []);

  // Calculate XP percentage for the progress bar
  const xpNeededForNextLevel = 100; // Simplified level formula from GameContext
  const currentLevelXp = gameState.experience % xpNeededForNextLevel;
  const xpPercentage = (currentLevelXp / xpNeededForNextLevel) * 100;
  
  // Handle energy refill with ad
  const handleEnergyRefill = () => {
    if (isWatchingAd) return;
    
    // Simulate watching an ad
    setIsWatchingAd(true);
    toast({
      title: "Ad Starting",
      description: "Watching ad to refill your energy...",
    });
    
    // Simulate ad completion after 2 seconds
    setTimeout(() => {
      resetEnergy();
      setIsWatchingAd(false);
      
      toast({
        title: "Energy Refilled!",
        description: "Your energy has been fully restored!",
        variant: "default",
      });
      
      // Create celebration animation
      createEnergyRefillAnimation();
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
                <Star className="h-5 w-5 text-gold mr-2" />
                <span className="text-sm font-medium">Level {gameState.level}</span>
              </div>
              <span className="text-xs text-gray-500">
                {currentLevelXp}/{xpNeededForNextLevel} XP
              </span>
            </div>
            <Progress value={xpPercentage} className="h-2" />
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
                      ? 'bg-orange-500 text-white animate-pulse-soft' 
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
                    className={`flex items-center space-x-2 ${isWatchingAd ? 'animate-pulse' : ''}`}
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
            <div className="bg-white p-4 rounded-xl shadow-md border border-purple/10">
              <h3 className="font-semibold mb-1 text-sm">Power Up!</h3>
              <p className="text-xs text-gray-600">
                Visit the shop to upgrade your tapping abilities!
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md border border-purple/10">
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
