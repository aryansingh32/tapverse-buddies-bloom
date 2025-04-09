
import { Gift, Sparkles, Calendar } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

export function RedeemSection() {
  const { gameState } = useGame();
  
  return (
    <div className="mt-4 p-6 rounded-xl bg-gradient-to-r from-gold/10 to-pink/10 border border-gold/20">
      <div className="flex items-center mb-4">
        <Gift className="h-6 w-6 text-gold mr-2" />
        <h2 className="text-xl font-bold bg-gradient-to-r from-gold to-pink bg-clip-text text-transparent">Redeem Coins</h2>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Redeem your hard-earned coins for real-world rewards! This feature is coming soon.
      </p>
      
      <div className="bg-white/50 p-4 rounded-lg mb-4">
        <h3 className="font-semibold text-sm mb-1 flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-purple" />
          Upcoming Rewards
        </h3>
        <p className="text-xs text-gray-600">
          Gift cards, merchandise, and exclusive digital items will be available soon!
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-purple/10 to-teal/10 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-sm mb-1">Current Balance</h3>
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 mr-1 text-gold" />
              <span className="font-bold text-lg text-purple">{Math.floor(gameState.coins)}</span>
              <span className="text-xs text-gray-500 ml-1">coins</span>
            </div>
          </div>
          <div className="bg-white/70 p-2 rounded-full h-12 w-12 flex items-center justify-center">
            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple to-teal">
              {Math.floor(gameState.coins / 100)}
            </span>
            <span className="text-[8px] text-gray-500 ml-0.5">lvl</span>
          </div>
        </div>
      </div>
    </div>
  );
}
