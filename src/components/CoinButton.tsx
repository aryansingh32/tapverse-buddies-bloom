
import { useState, useEffect } from "react";
import { useGame } from "../contexts/GameContext";
import { Sparkles } from "lucide-react";

export function CoinButton() {
  const { gameState, handleTap } = useGame();
  const [isTapped, setIsTapped] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [particleCount, setParticleCount] = useState(0);

  const handleCoinClick = () => {
    if (gameState.energy > 0) {
      handleTap();
      setIsTapped(true);
      createParticles();
      
      setTimeout(() => setIsTapped(false), 150);
    }
  };

  const createParticles = () => {
    const newParticles = [];
    const count = Math.min(3, Math.floor(gameState.tapPower));
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: particleCount + i,
        x: Math.random() * 60 - 30, // Random position around button
        y: -20 - Math.random() * 30,  // Start above the button
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    setParticleCount(prev => prev + count);
    
    // Clean up old particles
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  // Coin skin variants
  const coinSkins: Record<string, React.ReactNode> = {
    default: (
      <div className={`w-40 h-40 rounded-full bg-gradient-to-b from-gold via-yellow-500 to-amber-500 
                     flex items-center justify-center text-4xl font-bold text-amber-900
                     shadow-[0_0_15px_rgba(255,215,0,0.7)] border-4 border-yellow-300
                     transition-all duration-200 ${isTapped ? 'scale-90' : 'scale-100'}`}>
        <div className="transform -rotate-12">$</div>
      </div>
    ),
    neon: (
      <div className={`w-40 h-40 rounded-full bg-gradient-to-b from-teal to-blue-400 
                     flex items-center justify-center text-4xl font-bold text-white
                     shadow-[0_0_20px_rgba(29,233,182,0.7)] border-4 border-teal
                     transition-all duration-200 ${isTapped ? 'scale-90' : 'scale-100'}`}>
        <div className="transform -rotate-12">$</div>
      </div>
    ),
    diamond: (
      <div className={`w-40 h-40 rounded-full bg-gradient-to-b from-blue-300 via-blue-100 to-blue-300 
                     flex items-center justify-center text-4xl font-bold text-blue-600
                     shadow-[0_0_15px_rgba(147,197,253,0.7)] border-4 border-blue-200
                     transition-all duration-200 ${isTapped ? 'scale-90' : 'scale-100'}`}>
        <div className="transform -rotate-12">💎</div>
      </div>
    ),
  };

  return (
    <div className="relative h-64 flex items-center justify-center">
      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-yellow-500 animate-fade-out"
          style={{
            transform: `translate(${particle.x}px, ${particle.y}px)`,
            animation: 'coin-bounce 1s ease-out forwards, fade-out 1s ease-in forwards'
          }}
        >
          <Sparkles className="h-6 w-6" />
        </div>
      ))}
      
      {/* Main coin button */}
      <button
        className="tap-button transform transition-all duration-150 animate-float"
        onClick={handleCoinClick}
        disabled={gameState.energy <= 0}
      >
        {gameState.energy > 0 ? (
          coinSkins[gameState.selectedSkin] || coinSkins.default
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
