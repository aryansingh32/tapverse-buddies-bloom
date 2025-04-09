
import { useGame } from "../contexts/GameContext";
import { Coins, Battery, Zap } from "lucide-react";

export function ResourceDisplay() {
  const { gameState } = useGame();
  
  // Calculate the energy percentage
  const energyPercentage = (gameState.energy / gameState.maxEnergy) * 100;
  const energyColor = energyPercentage > 60 ? "bg-green-500" : 
                      energyPercentage > 30 ? "bg-amber-500" : "bg-red-500";
  
  return (
    <div className="w-full px-6 py-4 mt-4 rounded-xl glass shadow-lg">
      {/* Coins */}
      <div className="flex justify-around items-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-1">
            <Coins className="h-5 w-5 mr-1 text-gold animate-pulse-soft" />
            <span className="text-sm font-medium text-gray-600">Coins</span>
          </div>
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-500">
            {Math.floor(gameState.coins)}
          </span>
        </div>
        
        {/* Tap Power */}
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-1">
            <Zap className="h-5 w-5 mr-1 text-purple" />
            <span className="text-sm font-medium text-gray-600">Tap Power</span>
          </div>
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple to-teal">
            {gameState.tapPower.toFixed(1)}
          </span>
        </div>
        
        {/* Energy */}
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-1">
            <Battery className="h-5 w-5 mr-1 text-green-500" />
            <span className="text-sm font-medium text-gray-600">Energy</span>
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${energyColor} transition-all duration-500`} 
                style={{ width: `${energyPercentage}%` }}
              ></div>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-sm font-bold">{Math.floor(gameState.energy)}</span>
              <span className="text-xs text-gray-500 ml-1">/ {gameState.maxEnergy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
