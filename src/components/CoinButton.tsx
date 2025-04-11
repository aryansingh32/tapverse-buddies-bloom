
import { useState, useRef, useEffect } from "react";
import { useGame } from "../contexts/GameContext";
import { useToast } from "@/hooks/use-toast";
import { RhythmRing } from "./coin/RhythmRing";
import { CoinSkins, DisabledCoin } from "./coin/CoinSkins";
import { CoinFloatingText, ComboCounter } from "./coin/CoinFloatingText";
import { ParticleSystem } from "./coin/ParticleSystem";
import { useCoinTap } from "@/hooks/useCoinTap";
import { useCoinParticles } from "./coin/CoinParticlesContext";

export function CoinButton() {
  const { gameState } = useGame();
  const { toast } = useToast();
  const [showFloatingText, setShowFloatingText] = useState(false);
  const [floatingValue, setFloatingValue] = useState<string>("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { createCoinBurst, createFloatingNumber } = useCoinParticles();
  
  // Use the coin tap hook with proper callback functions
  const { 
    isTapped, 
    comboCounter, 
    handleCoinClick: originalHandleCoinClick, 
    isRhythmMode,
    beatProgress
  } = useCoinTap({
    showToast: toast,
    createParticles: () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        createCoinBurst(centerX, centerY, 3);
      }
    },
    createSpecialParticles: (isPerfect) => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        createCoinBurst(centerX, centerY, isPerfect ? 10 : 6);
      }
    },
    setFloatingValue,
    showFloatingText: () => {
      setShowFloatingText(true);
      setTimeout(() => setShowFloatingText(false), 1000);
    }
  });

  // Enhanced coin click handler with visual effects
  const handleCoinClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Original logic
    originalHandleCoinClick();
    
    if (gameState.energy <= 0) return;
    
    // Calculate where to show particles (relative to button)
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Create coin burst at tap position
      createCoinBurst(e.clientX, e.clientY, 5 + Math.floor(Math.random() * 5));
      
      // Create floating number
      const tapValue = Math.round(gameState.tapPower * 10) / 10;
      const powerMultiplier = gameState.powerBoostActive ? 2 : 1;
      const doubleMultiplier = gameState.doubleCoinsActive ? 2 : 1;
      const totalCoins = tapValue * powerMultiplier * doubleMultiplier;
      
      createFloatingNumber(
        centerX - 20 + Math.random() * 40, 
        centerY - 50, 
        `+${totalCoins.toFixed(1)}`
      );
      
      // For combo or special taps
      if (comboCounter > 1) {
        setTimeout(() => {
          createFloatingNumber(
            centerX - 20 + Math.random() * 40, 
            centerY - 80, 
            `COMBO x${comboCounter}`
          );
        }, 200);
      }
    }
  };

  return (
    <div className="relative h-64 flex items-center justify-center">
      {/* Floating value text and combo counter */}
      <CoinFloatingText value={floatingValue} visible={showFloatingText} />
      <ComboCounter combo={comboCounter} />
      
      {/* Rhythm ring indicator */}
      <RhythmRing isRhythmMode={isRhythmMode} beatProgress={beatProgress} />
      
      {/* Particles */}
      <ParticleSystem particles={[]} />
      
      {/* Main coin button */}
      <button
        ref={buttonRef}
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
