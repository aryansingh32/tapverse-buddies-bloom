
import { useGame } from "../contexts/GameContext";
import { Video } from "lucide-react";
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
    <div className="p-4 rounded-xl bg-white border-2 border-purple/20 shadow-md transition-all duration-200 hover:shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{getEffectIcon(effect)}</span>
          <h3 className="font-bold text-lg">{name}</h3>
        </div>
        <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
          Owned: {owned}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-purple font-medium text-sm">
            Watch Ad
          </span>
        </div>
        
        <button
          onClick={handleWatchAd}
          className="px-4 py-1 rounded-lg text-white font-medium bg-purple hover:bg-purple/80 transition-colors duration-200 flex items-center"
        >
          <Video className="w-4 h-4 mr-1" />
          Watch
        </button>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        +{value} {effect === 'tapPower' ? 'tap power' : effect === 'coinMultiplier' ? 'multiplier' : 'max energy'}
      </div>
    </div>
  );
}
