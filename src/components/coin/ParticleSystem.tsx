
import React, { useState } from "react";
import { CoinParticle } from "./CoinParticle";

interface Particle {
  id: number;
  x: number;
  y: number;
  type: "sparkle" | "coin" | "note";
  color: string;
}

export function useParticleSystem() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [particleCount, setParticleCount] = useState(0);

  const createParticles = () => {
    const newParticles = [];
    const count = Math.min(12, 4); // Basic particle count
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

  return {
    particles,
    createParticles,
    createSpecialParticles
  };
}

interface ParticleSystemProps {
  particles: Particle[];
}

export function ParticleSystem({ particles }: ParticleSystemProps) {
  return (
    <>
      {particles.map((particle) => (
        <CoinParticle
          key={particle.id}
          id={particle.id}
          x={particle.x}
          y={particle.y}
          type={particle.type}
          color={particle.color}
        />
      ))}
    </>
  );
}
