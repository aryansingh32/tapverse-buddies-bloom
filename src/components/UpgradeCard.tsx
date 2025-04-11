
import { useState } from "react";
import { useGame } from "../contexts/GameContext";
import { Video, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UpgradeCardProps {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: string;
  value: number;
  owned: number;
  adPowered?: boolean;
}

export function UpgradeCard({ 
  id, 
  name, 
  description, 
  cost, 
  effect, 
  value, 
  owned,
  adPowered = true 
}: UpgradeCardProps) {
  const { gameState, buyUpgrade } = useGame();
  const { toast } = useToast();
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleWatchAd = () => {
    if (isWatchingAd) return;
    
    // Simulate ad watching
    setIsWatchingAd(true);
    toast({
      title: "Ad Starting",
      description: "Watching ad to earn your upgrade...",
    });
    
    // Simulate ad completion after 2 seconds
    setTimeout(() => {
      setIsWatchingAd(false);
      buyUpgrade(id);
      
      // Start upgrade animation
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1500);
      
      toast({
        title: "Upgrade Unlocked!",
        description: `You've unlocked the ${name} upgrade!`,
        variant: "default",
      });
    }, 2000);
  };
  
  const handleBuyWithCoins = () => {
    if (gameState.coins < cost) {
      toast({
        title: "Not Enough Coins",
        description: `You need ${cost - gameState.coins} more coins to buy this upgrade.`,
        variant: "destructive",
      });
      return;
    }
    
    buyUpgrade(id);
    
    // Start upgrade animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1500);
    
    toast({
      title: "Upgrade Purchased!",
      description: `You've purchased the ${name} upgrade!`,
      variant: "default",
    });
  };
  
  // Determine the icon based on the effect
  const getEffectIcon = (effect: string) => {
    switch (effect) {
      case 'tapPower':
        return '👆';
      case 'coinMultiplier':
        return '✨';
      case 'maxEnergy':
        return '⚡';
      default:
        return '🎁';
    }
  };
  
  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br from-white to-purple/5 border-2 border-purple/20 shadow-lg 
      transition-all duration-200 hover:shadow-xl hover:translate-y-[-2px]
      ${isAnimating ? 'animate-pulse border-purple' : ''}
    `}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className={`text-2xl mr-2 ${isAnimating ? 'animate-bounce' : 'animate-pulse-soft'}`}>
            {getEffectIcon(effect)}
          </span>
          <h3 className="font-bold text-lg bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent">{name}</h3>
        </div>
        <span className="text-sm bg-purple/10 px-3 py-1 rounded-full text-purple font-medium">
          Owned: {owned}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      
      <div className="flex justify-between items-center">
        {adPowered ? (
          <div className="flex items-center">
            <span className="text-purple font-medium text-sm flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-gold" />
              Watch Ad
            </span>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-purple font-medium text-sm flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-gold" />
              {cost} coins
            </span>
          </div>
        )}
        
        {adPowered ? (
          <button
            onClick={handleWatchAd}
            disabled={isWatchingAd}
            className={`px-4 py-2 rounded-lg text-white font-medium 
              bg-gradient-to-r from-purple to-teal hover:brightness-110 
              transition-all duration-200 flex items-center shadow-md
              ${isWatchingAd ? 'opacity-70 animate-pulse' : ''}
              ${isAnimating ? 'animate-bounce' : ''}`}
          >
            <Video className="w-4 h-4 mr-1" />
            {isWatchingAd ? 'Loading...' : 'Watch'}
          </button>
        ) : (
          <button
            onClick={handleBuyWithCoins}
            disabled={gameState.coins < cost}
            className={`px-4 py-2 rounded-lg text-white font-medium 
              bg-gradient-to-r from-purple to-teal hover:brightness-110 
              transition-all duration-200 flex items-center shadow-md
              ${gameState.coins < cost ? 'opacity-50 cursor-not-allowed' : ''}
              ${isAnimating ? 'animate-bounce' : ''}`}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Buy
          </button>
        )}
      </div>
      
      <div className="mt-3 text-xs bg-gold/10 p-2 rounded-lg text-amber-700 font-medium">
        +{value} {effect === 'tapPower' ? 'tap power' : effect === 'coinMultiplier' ? 'multiplier' : 'max energy'}
      </div>
      
      {isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => {
            const size = 10 + Math.random() * 20;
            const left = Math.random() * 100;
            const animDuration = 1 + Math.random() * 2;
            return (
              <div 
                key={i}
                className="absolute rounded-full z-10"
                style={{
                  left: `${left}%`,
                  top: '100%',
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: `hsl(${Math.random() * 60 + 280}, 70%, 60%)`,
                  animation: `float-up ${animDuration}s ease-out forwards`,
                  opacity: 0.7
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
