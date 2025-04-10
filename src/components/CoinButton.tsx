
import { useState, useEffect, useRef } from "react";
import { useGame } from "../contexts/GameContext";
import { Sparkles, Coins, Music } from "lucide-react";
import { BEAT_PATTERNS, useRhythmMode } from "./RhythmMode";
import { useToast } from "@/hooks/use-toast";

export function CoinButton() {
  const { gameState, handleTap } = useGame();
  const { toast } = useToast();
  const [isTapped, setIsTapped] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; type: "sparkle" | "coin" | "note"; color: string }>>([]);
  const [particleCount, setParticleCount] = useState(0);
  const [showFloatingText, setShowFloatingText] = useState(false);
  const [floatingValue, setFloatingValue] = useState<string>("");
  const [comboCounter, setComboCounter] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  
  // Get rhythm mode functionality
  const { 
    isRhythmMode, 
    checkTapRhythm,
    currentPattern,
    beatProgress
  } = useRhythmMode();

  // Create a ring effect around the coin button when in rhythm mode
  const rhythmRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRhythmMode && rhythmRingRef.current) {
      rhythmRingRef.current.style.transform = `scale(${0.8 + beatProgress * 0.004})`;
      rhythmRingRef.current.style.opacity = `${beatProgress * 0.01}`;
    }
  }, [beatProgress, isRhythmMode]);

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

  const createParticles = () => {
    const newParticles = [];
    const count = Math.min(12, Math.floor(gameState.tapPower) + 4); // More particles based on tap power
    const colors = ['#FFD700', '#7C4DFF', '#1DE9B6', '#FF4081']; // Gold, Purple, Teal, Pink
    
    for (let i = 0; i < count; i++) {
      const type = Math.random() > 0.4 ? "sparkle" : "coin";
      newParticles.push({
        id: particleCount + i,
        // Create particles in a wider arc
        x: Math.random() * 240 - 120, 
        y: -30 - Math.random() * 60,
        type,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    setParticleCount(prev => prev + count);
    
    // Clean up old particles
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1500);
  };

  // Special particle effect for rhythm mode hits
  const createSpecialParticles = (isPerfect: boolean) => {
    const newParticles = [];
    // Create more particles for perfect hits
    const count = isPerfect ? 20 : 12;
    const colors = isPerfect 
      ? ['#FFD700', '#FFA500', '#FF4500', '#FF6347'] // Gold, Orange, Red-Orange for perfect hits
      : ['#7C4DFF', '#1DE9B6', '#3F51B5', '#2196F3']; // Purple, Teal, Indigo, Blue for good hits
    
    for (let i = 0; i < count; i++) {
      // Mix of particle types with music notes for rhythm hits
      const typeRoll = Math.random();
      let type: "sparkle" | "coin" | "note" = "sparkle";
      
      if (typeRoll > 0.6) type = "coin";
      if (typeRoll > 0.8) type = "note";
      
      newParticles.push({
        id: particleCount + i,
        // Create particles in a circular pattern
        x: Math.cos(i * Math.PI * 2 / count) * 120 * (0.5 + Math.random() * 0.5),
        y: Math.sin(i * Math.PI * 2 / count) * 120 * (0.5 + Math.random() * 0.5) - 30,
        type,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    setParticleCount(prev => prev + count);
    
    // Clean up old particles
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1500);
  };

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

  return (
    <div className="relative h-64 flex items-center justify-center">
      {/* Floating value text */}
      <div className={`absolute -top-12 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple to-teal transition-opacity duration-300 ${showFloatingText ? 'opacity-100' : 'opacity-0'}`}>
        {floatingValue} <Coins className="h-4 w-4 inline mb-1 text-gold" />
      </div>
      
      {/* Combo counter */}
      {comboCounter > 2 && (
        <div className="absolute -top-20 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
          {comboCounter}x Combo!
        </div>
      )}
      
      {/* Rhythm ring indicator */}
      {isRhythmMode && (
        <div 
          ref={rhythmRingRef}
          className="absolute w-48 h-48 rounded-full border-4 border-purple opacity-50 transition-all duration-100"
        ></div>
      )}
      
      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            transform: `translate(${particle.x}px, ${particle.y}px)`,
            animation: 'enhanced-coin-bounce 1.5s ease-out forwards, fade-out 1s ease-in forwards',
            zIndex: 10
          }}
        >
          {particle.type === "sparkle" ? (
            <Sparkles className="h-6 w-6" style={{ color: particle.color }} />
          ) : particle.type === "note" ? (
            <Music className="h-6 w-6" style={{ color: particle.color }} />
          ) : (
            <Coins className="h-5 w-5" style={{ color: particle.color }} />
          )}
        </div>
      ))}
      
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
            {coinSkins[gameState.selectedSkin] || coinSkins.default}
          </div>
        ) : (
          <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-gray-500
                       border-4 border-gray-400 opacity-60">
            <div className="transform -rotate-12">$</div>
          </div>
        )}
      </button>
    </div>
  );
}
