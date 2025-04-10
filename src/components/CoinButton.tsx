
import { useState, useEffect } from "react";
import { useGame } from "../contexts/GameContext";
import { Coins } from "lucide-react";
import { BEAT_PATTERNS } from "@/constants/beatPatterns";
import { useRhythmMode } from "@/hooks/useRhythmMode";
import { useToast } from "@/hooks/use-toast";

import { RhythmRing } from "./coin/RhythmRing";
import { CoinSkins, DisabledCoin } from "./coin/CoinSkins";
import { CoinFloatingText, ComboCounter } from "./coin/CoinFloatingText";
import { useParticleSystem, ParticleSystem } from "./coin/ParticleSystem";

export function CoinButton() {
  const { gameState, handleTap } = useGame();
  const { toast } = useToast();
  const [isTapped, setIsTapped] = useState(false);
  const [showFloatingText, setShowFloatingText] = useState(false);
  const [floatingValue, setFloatingValue] = useState<string>("");
  const [comboCounter, setComboCounter] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  
  // Get particle system functionality
  const { particles, createParticles, createSpecialParticles } = useParticleSystem();
  
  // Get rhythm mode functionality
  const { 
    isRhythmMode, 
    checkTapRhythm,
    currentPattern,
    beatProgress
  } = useRhythmMode();

  const handleCoinClick = () => {
    if (gameState.energy <= 0) return;
    
    const now = Date.now();
    setLastTapTime(now);
    
    // Check if tap is in rhythm (if rhythm mode is enabled)
    let coinMultiplier = 1;
    let rhythmMatch = { matched: false, multiplier: 1 };
    
    if (isRhythmMode) {
      rhythmMatch = checkTapRhythm(now);
      coinMultiplier = rhythmMatch.multiplier;
      
      // Update combo counter
      if (rhythmMatch.matched) {
        setComboCounter(prev => prev + 1);
        
        if (comboCounter >= 5) {
          toast({
            title: `${comboCounter + 1}x Combo!`,
            description: "Keep the rhythm going!",
            duration: 1500,
          });
        }
      } else {
        // Reset combo if rhythm was missed
        if (comboCounter > 3) {
          toast({
            title: "Combo Lost!",
            description: "Try to stay on beat!",
            variant: "destructive",
            duration: 1500,
          });
        }
        setComboCounter(0);
      }
    }
    
    // Apply tap with any applicable multiplier
    handleTap();
    setIsTapped(true);
    
    // Generate special particles for rhythm matches
    if (rhythmMatch.matched) {
      createSpecialParticles(rhythmMatch.multiplier > 1.2);
      
      // Show the multiplier as floating text
      setFloatingValue(`+${(gameState.tapPower * rhythmMatch.multiplier).toFixed(1)} (x${rhythmMatch.multiplier.toFixed(1)})`);
    } else {
      createParticles();
      setFloatingValue(`+${gameState.tapPower.toFixed(1)}`);
    }
    
    showFloatingCoinValue();
    setTimeout(() => setIsTapped(false), 150);
  };

  const showFloatingCoinValue = () => {
    setShowFloatingText(true);
    setTimeout(() => setShowFloatingText(false), 1000);
  };

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
