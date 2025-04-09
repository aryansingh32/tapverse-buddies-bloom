
import { useGame } from "../contexts/GameContext";
import { Video, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UpgradeCardProps {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: string;
  value: number;
  owned: number;
}

export function UpgradeCard({ id, name, description, cost, effect, value, owned }: UpgradeCardProps) {
  const { gameState, buyUpgrade } = useGame();
  
  const handleWatchAd = () => {
    // Simulate ad watching
    toast({
      title: "Ad Starting",
      description: "Watching ad to earn your upgrade...",
    });
    
    // Simulate ad completion after 2 seconds
    setTimeout(() => {
      buyUpgrade(id);
      toast({
        title: "Upgrade Unlocked!",
        description: `You've unlocked the ${name} upgrade!`,
        variant: "default", // Changed from "success" to "default"
      });
    }, 2000);
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
    <div className="p-4 rounded-xl bg-gradient-to-br from-white to-purple/5 border-2 border-purple/20 shadow-lg transition-all duration-200 hover:shadow-xl hover:translate-y-[-2px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-2xl mr-2 animate-pulse-soft">{getEffectIcon(effect)}</span>
          <h3 className="font-bold text-lg bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent">{name}</h3>
        </div>
        <span className="text-sm bg-purple/10 px-3 py-1 rounded-full text-purple font-medium">
          Owned: {owned}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-purple font-medium text-sm flex items-center">
            <Sparkles className="w-4 h-4 mr-1 text-gold" />
            Watch Ad
          </span>
        </div>
        
        <button
          onClick={handleWatchAd}
          className="px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-purple to-teal hover:brightness-110 transition-all duration-200 flex items-center shadow-md"
        >
          <Video className="w-4 h-4 mr-1" />
          Watch
        </button>
      </div>
      
      <div className="mt-3 text-xs bg-gold/10 p-2 rounded-lg text-amber-700 font-medium">
        +{value} {effect === 'tapPower' ? 'tap power' : effect === 'coinMultiplier' ? 'multiplier' : 'max energy'}
      </div>
    </div>
  );
}
