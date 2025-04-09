
import { Gift } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

export function RedeemSection() {
  const { gameState } = useGame();
  
  return (
    <div className="mt-10 p-6 rounded-xl bg-gradient-to-r from-gold/10 to-pink/10 border border-gold/20">
      <div className="flex items-center mb-4">
        <Gift className="h-6 w-6 text-gold mr-2" />
        <h2 className="text-xl font-bold">Redeem Coins</h2>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Redeem your hard-earned coins for real-world rewards! This feature is coming soon.
      </p>
      
      <div className="bg-white/50 p-4 rounded-lg">
        <h3 className="font-semibold text-sm mb-1">Coming Soon!</h3>
        <p className="text-xs text-gray-600">
          Keep tapping and collecting coins! You'll be able to redeem them for exciting rewards in future updates.
        </p>
        <div className="mt-3 flex items-center">
          <span className="text-xs text-gray-500">Your current balance:</span>
          <span className="ml-1 font-bold text-gold">{Math.floor(gameState.coins)} coins</span>
        </div>
      </div>
    </div>
  );
}
