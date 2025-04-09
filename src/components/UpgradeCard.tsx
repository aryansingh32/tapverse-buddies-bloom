
import { useGame } from "../contexts/GameContext";

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
  const canAfford = gameState.coins >= cost;
  
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
    <div className={`p-4 rounded-xl bg-white border-2 ${canAfford ? 'border-purple/20' : 'border-gray-200'} shadow-md transition-all duration-200 hover:shadow-lg`}>
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
          <span className="text-gold font-bold">
            {cost} 
          </span>
          <span className="text-xs ml-1">coins</span>
        </div>
        
        <button
          onClick={() => buyUpgrade(id)}
          disabled={!canAfford}
          className={`px-4 py-1 rounded-lg text-white font-medium
                     transition-colors duration-200 ${
            canAfford
              ? 'bg-purple hover:bg-purple/80'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Buy
        </button>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        +{value} {effect === 'tapPower' ? 'tap power' : effect === 'coinMultiplier' ? 'multiplier' : 'max energy'}
      </div>
    </div>
  );
}
