
import { useState, useEffect } from "react";
import { useGame } from "../contexts/GameContext";
import { useRhythmMode } from "./useRhythmMode";
import { sounds, playSound } from "@/utils/audioUtils";

interface UseCoinTapProps {
  showToast: any;
  createParticles: () => void;
  createSpecialParticles: (isPerfect: boolean) => void;
  setFloatingValue: (value: string) => void;
  showFloatingText: () => void;
}

export function useCoinTap({
  showToast,
  createParticles,
  createSpecialParticles,
  setFloatingValue,
  showFloatingText
}: UseCoinTapProps) {
  const { gameState, handleTap } = useGame();
  const [isTapped, setIsTapped] = useState(false);
  const [comboCounter, setComboCounter] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  
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
    let rhythmMatch = { matched: false, multiplier: 1 };
    
    if (isRhythmMode) {
      rhythmMatch = checkTapRhythm(now);
      
      // Update combo counter
      if (rhythmMatch.matched) {
        setComboCounter(prev => prev + 1);
        
        if (comboCounter >= 5) {
          // Auto-dismiss toast for combo
          showToast({
            title: `${comboCounter + 1}x Combo!`,
            description: "Keep the rhythm going!",
            duration: 1500,
          });
          
          // Try to vibrate device in rhythm pattern
          try {
            if (window.navigator.vibrate) {
              window.navigator.vibrate([20, 50, 20]);
            }
          } catch (err) {
            // Ignore vibration errors
          }
        }
      } else {
        // Reset combo if rhythm was missed
        if (comboCounter > 3) {
          // Auto-dismiss toast for combo lost
          showToast({
            title: "Combo Lost!",
            description: "Try to stay on beat!",
            variant: "destructive",
            duration: 1500,
          });
          
          // Try to vibrate device on combo lost
          try {
            if (window.navigator.vibrate) {
              window.navigator.vibrate(100);
            }
          } catch (err) {
            // Ignore vibration errors
          }
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
      
      // Play perfect sound for high multipliers
      if (rhythmMatch.multiplier > 1.2 && sounds.perfectSound) {
        try {
          playSound(sounds.perfectSound);
        } catch (err) {
          console.warn("Could not play perfect sound:", err);
        }
      }
    } else {
      createParticles();
      setFloatingValue(`+${gameState.tapPower.toFixed(1)}`);
    }
    
    showFloatingText();
    setTimeout(() => setIsTapped(false), 150);
  };

  return {
    isTapped,
    comboCounter,
    handleCoinClick,
    isRhythmMode,
    beatProgress
  };
}
