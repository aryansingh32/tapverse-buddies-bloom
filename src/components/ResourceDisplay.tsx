
import { useGame } from "../contexts/GameContext";
import { Coins, Battery } from "lucide-react";

export function ResourceDisplay() {
  const { gameState } = useGame();
  
  return (
    <div className="w-full flex justify-around items-center px-8 py-4 mt-4 rounded-xl glass">
      {/* Coins */}
      <div className="flex flex-col items-center">
        <div className="flex items-center mb-1">
          <Coins className="h-5 w-5 mr-1 text-gold" />
          <span className="text-sm font-medium text-gray-600">Coins</span>
        </div>
        <span className="text-xl font-bold">{Math.floor(gameState.coins)}</span>
      </div>
      
      {/* Tap Power */}
      <div className="flex flex-col items-center">
        <div className="flex items-center mb-1">
          <span className="text-lg mr-1">👆</span>
          <span className="text-sm font-medium text-gray-600">Tap Power</span>
        </div>
        <span className="text-xl font-bold">{gameState.tapPower.toFixed(1)}</span>
      </div>
      
      {/* Energy */}
      <div className="flex flex-col items-center">
        <div className="flex items-center mb-1">
          <Battery className="h-5 w-5 mr-1 text-green-500" />
          <span className="text-sm font-medium text-gray-600">Energy</span>
        </div>
        <div className="flex items-center">
          <span className="text-xl font-bold">{Math.floor(gameState.energy)}</span>
          <span className="text-sm text-gray-500 ml-1">/ {gameState.maxEnergy}</span>
        </div>
      </div>
    </div>
  );
}
