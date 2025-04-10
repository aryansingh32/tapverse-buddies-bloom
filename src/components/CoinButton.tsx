
import { useState } from "react";
import { useGame } from "../contexts/GameContext";
import { useToast } from "@/hooks/use-toast";

// Import the refactored components and hooks
import { RhythmRing } from "./coin/RhythmRing";
import { CoinSkins, DisabledCoin } from "./coin/CoinSkins";
import { CoinFloatingText, ComboCounter } from "./coin/CoinFloatingText";
import { useParticleSystem, ParticleSystem } from "./coin/ParticleSystem";
import { useCoinTap } from "@/hooks/useCoinTap";

export function CoinButton() {
  const { gameState } = useGame();
  const { toast } = useToast();
  const [showFloatingText, setShowFloatingText] = useState(false);
  const [floatingValue, setFloatingValue] = useState<string>("");
  
  // Use the refactored hooks
  const { particles, createParticles, createSpecialParticles } = useParticleSystem();
  const { 
    isTapped, 
    comboCounter, 
    handleCoinClick, 
    isRhythmMode,
    beatProgress
  } = useCoinTap({
    showToast: toast,
    createParticles,
    createSpecialParticles,
    setFloatingValue,
    showFloatingText: () => {
      setShowFloatingText(true);
      setTimeout(() => setShowFloatingText(false), 1000);
    }
  });

  return (
    <div className="relative h-64 flex items-center justify-center">
      {/* Floating value text and combo counter */}
      <CoinFloatingText value={floatingValue} visible={showFloatingText} />
      <ComboCounter combo={comboCounter} />
      
      {/* Rhythm ring indicator */}
      <RhythmRing isRhythmMode={isRhythmMode} beatProgress={beatProgress} />
      
      {/* Particles */}
      <ParticleSystem particles={particles} />
      
      {/* Main coin button */}
      <button
        className="tap-button transform transition-all duration-150 animate-float relative z-0"
        onClick={handleCoinClick}
        disabled={gameState.energy <= 0}
      >
        {gameState.energy > 0 ? (
          <div className="relative">
            {/* Glow effect behind coin */}
            <div className={`absolute inset-0 rounded-full blur-xl transform scale-110 ${
              isRhythmMode ? 'bg-purple/40 animate-pulse-soft' : 'bg-gold/30'
            }`}></div>
            <CoinSkins skin={gameState.selectedSkin} isTapped={isTapped} />
          </div>
        ) : (
          <DisabledCoin />
        )}
      </button>
    </div>
  );
}
