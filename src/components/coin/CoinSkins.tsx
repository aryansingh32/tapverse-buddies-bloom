
import React from "react";

interface CoinSkinProps {
  skin: string;
  isTapped: boolean;
}

export function CoinSkins({ skin, isTapped }: CoinSkinProps) {
  // Coin skin variants
  const coinSkins: Record<string, React.ReactNode> = {
    default: (
      <div className={`w-40 h-40 rounded-full bg-gradient-to-b from-gold via-yellow-500 to-amber-500 
                     flex items-center justify-center text-4xl font-bold text-amber-900
                     shadow-[0_0_20px_rgba(255,215,0,0.6)] border-4 border-yellow-300
                     transition-all duration-200 ${isTapped ? 'scale-90' : 'scale-100'}`}>
        <div className="transform -rotate-12 animate-coin-spin">$</div>
      </div>
    ),
    neon: (
      <div className={`w-40 h-40 rounded-full bg-gradient-to-b from-teal to-blue-400 
                     flex items-center justify-center text-4xl font-bold text-white
                     shadow-[0_0_25px_rgba(29,233,182,0.7)] border-4 border-teal
                     transition-all duration-200 ${isTapped ? 'scale-90' : 'scale-100'}`}>
        <div className="transform -rotate-12 animate-coin-spin">$</div>
      </div>
    ),
    diamond: (
      <div className={`w-40 h-40 rounded-full bg-gradient-to-b from-blue-300 via-blue-100 to-blue-300 
                     flex items-center justify-center text-4xl font-bold text-blue-600
                     shadow-[0_0_20px_rgba(147,197,253,0.7)] border-4 border-blue-200
                     transition-all duration-200 ${isTapped ? 'scale-90' : 'scale-100'}`}>
        <div className="transform -rotate-12 animate-coin-spin">💎</div>
      </div>
    ),
  };

  return coinSkins[skin] || coinSkins.default;
}

// Disabled coin state
export function DisabledCoin() {
  return (
    <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-gray-500
                  border-4 border-gray-400 opacity-60">
      <div className="transform -rotate-12">$</div>
    </div>
  );
}
