
import { useState, useRef, useEffect } from "react";
import { useGame } from "../contexts/GameContext";
import { useToast } from "@/hooks/use-toast";
import { RhythmRing } from "./coin/RhythmRing";
import { CoinSkins, DisabledCoin } from "./coin/CoinSkins";
import { CoinFloatingText, ComboCounter } from "./coin/CoinFloatingText";
import { ParticleSystem } from "./coin/ParticleSystem";
import { useCoinTap } from "@/hooks/useCoinTap";
import { useCoinParticles } from "./coin/CoinParticlesContext";
import { sounds, playSound } from "@/utils/audioUtils";

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
        createCoinBurst(centerX, centerY, isPerfect ? 20 : 10);
        
        // Add sparkle effect for perfect taps
        if (isPerfect) {
          createSparkleEffect(centerX, centerY);
        }
      }
    },
    setFloatingValue,
    showFloatingText: () => {
      setShowFloatingText(true);
      setTimeout(() => setShowFloatingText(false), 1000);
    }
  });

  // Enhanced coin click handler with visual effects
  const handleCoinClick = () => {
    // Original logic
    originalHandleCoinClick();
    
    if (gameState.energy <= 0) return;
    
    // Calculate where to show particles (relative to button)
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Create coin burst at random positions around the center
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 60;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        createCoinBurst(x, y, 1);
      }
      
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
      
      // Try to vibrate device
      try {
        if (window.navigator.vibrate) {
          window.navigator.vibrate(30);
        }
      } catch (err) {
        // Ignore vibration errors
      }
      
      // Play tap sound with random pitch variation for more dynamic feel
      if (sounds.tapSound) {
        try {
          // Random pitch variation for more dynamic feel
          sounds.tapSound.playbackRate = 0.9 + Math.random() * 0.3;
          playSound(sounds.tapSound);
        } catch (err) {
          console.warn("Could not play sound:", err);
        }
      }
    }
  };
  
  // Create sparkle effect for perfect hits
  const createSparkleEffect = (x: number, y: number) => {
    // Play perfect sound
    if (sounds.perfectSound) {
      try {
        playSound(sounds.perfectSound);
      } catch (err) {
        console.warn("Could not play perfect sound:", err);
      }
    }
    
    // Add visual sparkle elements to the DOM
    const container = document.querySelector('.coin-particles-container');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'absolute pointer-events-none';
      
      const size = 10 + Math.floor(Math.random() * 15);
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 100;
      
      const sparkleX = Math.cos(angle) * distance;
      const sparkleY = Math.sin(angle) * distance;
      
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.zIndex = '9999';
      sparkle.style.transform = 'translate(-50%, -50%)';
      sparkle.style.setProperty('--random-y', `${sparkleY}px`);
      sparkle.style.setProperty('--random-rotate', `${Math.random() * 360}deg`);
      
      // Choose random sparkle type
      const sparkleType = Math.floor(Math.random() * 3);
      
      if (sparkleType === 0) {
        // Star shape
        sparkle.innerHTML = `<span style="
          font-size: ${size}px; 
          color: ${['#FFD700', '#FFA500', '#FF4500'][Math.floor(Math.random() * 3)]};
          animation: confetti-explosion 1s forwards ease-out;
          display: block;
        ">✦</span>`;
      } else if (sparkleType === 1) {
        // Circle shape
        sparkle.innerHTML = `<div style="
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,215,0,1) 0%, rgba(255,140,0,0) 70%);
          animation: confetti-explosion 1s forwards ease-out;
        "></div>`;
      } else {
        // Diamond shape
        sparkle.innerHTML = `<span style="
          font-size: ${size}px; 
          color: ${['#40E0D0', '#9370DB', '#FF6347'][Math.floor(Math.random() * 3)]};
          animation: confetti-explosion 1.2s forwards ease-out;
          display: block;
        ">♦</span>`;
      }
      
      container.appendChild(sparkle);
      
      // Clean up
      setTimeout(() => {
        sparkle.remove();
      }, 1200);
    }
  };
  
  // Effect for auto-tap animation
  useEffect(() => {
    let autoTapInterval: NodeJS.Timeout | null = null;
    
    if (gameState.autoTapActive) {
      autoTapInterval = setInterval(() => {
        if (buttonRef.current && gameState.energy > 0) {
          // Add subtle pulse effect on auto-tap
          buttonRef.current.classList.add('animate-pulse-soft');
          setTimeout(() => {
            buttonRef.current?.classList.remove('animate-pulse-soft');
          }, 500);
          
          // Create mini particles for auto-tap
          const rect = buttonRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          // Random position around the coin
          const angle = Math.random() * Math.PI * 2;
          const distance = 30 + Math.random() * 20;
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;
          
          createCoinBurst(x, y, 1);
          
          // Play softer tap sound for auto-tap
          if (sounds.tapSound) {
            try {
              sounds.tapSound.volume = 0.3;
              sounds.tapSound.playbackRate = 0.8 + Math.random() * 0.3;
              playSound(sounds.tapSound);
              sounds.tapSound.volume = 1.0; // Reset volume
            } catch (err) {
              console.warn("Could not play sound:", err);
            }
          }
        }
      }, 1000);
    }
    
    return () => {
      if (autoTapInterval) {
        clearInterval(autoTapInterval);
      }
    };
  }, [gameState.autoTapActive, gameState.energy, createCoinBurst]);
  
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
        className={`tap-button transform transition-all duration-150 animate-float relative z-0 ${isTapped ? 'scale-95' : ''}`}
        onClick={handleCoinClick}
        disabled={gameState.energy <= 0}
      >
        {gameState.energy > 0 ? (
          <div className="relative">
            {/* Glow effect behind coin */}
            <div className={`absolute inset-0 rounded-full blur-xl transform scale-110 ${
              isRhythmMode ? 'bg-purple/40 animate-pulse-soft' : 'bg-gold/30'
            } ${gameState.powerBoostActive ? 'animate-glow-pulse' : ''}`}></div>
            <CoinSkins skin={gameState.selectedSkin} isTapped={isTapped} />
            
            {/* Boost effects */}
            {gameState.powerBoostActive && (
              <div className="absolute -inset-3 rounded-full border-2 border-purple animate-pulse-soft opacity-60"></div>
            )}
            {gameState.doubleCoinsActive && (
              <div className="absolute -inset-4 rounded-full border-2 border-gold animate-pulse-soft opacity-40"></div>
            )}
          </div>
        ) : (
          <DisabledCoin />
        )}
      </button>
    </div>
  );
}
