
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  type: 'coin' | 'sparkle' | 'star' | 'number';
  value?: string;
  size: number;
  opacity: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
  color: string;
}

interface CoinParticlesContextType {
  createCoinBurst: (x: number, y: number, count?: number) => void;
  createFloatingNumber: (x: number, y: number, value: string) => void;
  particles: Particle[];
}

const CoinParticlesContext = createContext<CoinParticlesContextType | undefined>(undefined);

export function CoinParticlesProvider({ children }: { children: ReactNode }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [nextId, setNextId] = useState(1);

  // Clean up expired particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const timer = setInterval(() => {
      setParticles(currentParticles => 
        currentParticles.filter(p => p.opacity > 0)
      );
    }, 100);
    
    return () => clearInterval(timer);
  }, [particles]);

  // Update particle positions and properties
  useEffect(() => {
    if (particles.length === 0) return;
    
    const animationFrame = requestAnimationFrame(() => {
      setParticles(currentParticles => 
        currentParticles.map(p => ({
          ...p,
          x: p.x + p.velocityX,
          y: p.y + p.velocityY,
          velocityY: p.velocityY + 0.1, // gravity
          rotation: p.rotation + p.velocityX * 2,
          opacity: p.opacity - 0.01,
          size: p.type === 'number' ? p.size : Math.max(p.size - 0.1, 0)
        }))
      );
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [particles]);

  // Create a burst of coin particles
  const createCoinBurst = (x: number, y: number, count = 10) => {
    const newParticles: Particle[] = [];
    const particleTypes = ['coin', 'sparkle', 'star'];
    const colors = ['#ffd700', '#ffb700', '#ff9500', '#ffffff'];
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 1 + Math.random() * 3;
      const type = particleTypes[Math.floor(Math.random() * particleTypes.length)] as 'coin' | 'sparkle' | 'star';
      
      newParticles.push({
        id: nextId + i,
        x,
        y,
        type,
        size: 5 + Math.random() * 15,
        opacity: 0.9,
        rotation: Math.random() * 360,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - 2, // initial upward velocity
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    setNextId(nextId + count);
    setParticles(current => [...current, ...newParticles]);
  };

  // Create floating number animation
  const createFloatingNumber = (x: number, y: number, value: string) => {
    const newParticle: Particle = {
      id: nextId,
      x,
      y,
      type: 'number',
      value,
      size: 24,
      opacity: 1,
      rotation: 0,
      velocityX: 0,
      velocityY: -2,
      color: value.includes('+') ? '#4fd1c5' : '#ff9500'
    };
    
    setNextId(nextId + 1);
    setParticles(current => [...current, newParticle]);
  };

  return (
    <CoinParticlesContext.Provider value={{ particles, createCoinBurst, createFloatingNumber }}>
      <div className="coin-particles-container fixed inset-0 pointer-events-none z-30">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              opacity: particle.opacity,
              transform: `rotate(${particle.rotation}deg)`,
              transition: 'opacity 0.1s ease-out',
              zIndex: 9999
            }}
          >
            {particle.type === 'coin' && (
              <div
                className="rounded-full bg-gold"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  boxShadow: '0 0 5px rgba(255, 215, 0, 0.7)'
                }}
              />
            )}
            {particle.type === 'sparkle' && (
              <div
                className="sparkle"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`
                }}
              />
            )}
            {particle.type === 'star' && (
              <div className="text-center" style={{ fontSize: `${particle.size}px` }}>
                ✨
              </div>
            )}
            {particle.type === 'number' && particle.value && (
              <div
                className="font-bold text-center"
                style={{
                  fontSize: `${particle.size}px`,
                  color: particle.color,
                  textShadow: '0px 0px 3px rgba(0,0,0,0.2)'
                }}
              >
                {particle.value}
              </div>
            )}
          </div>
        ))}
      </div>
      {children}
    </CoinParticlesContext.Provider>
  );
}

export const useCoinParticles = () => {
  const context = useContext(CoinParticlesContext);
  if (!context) {
    throw new Error("useCoinParticles must be used within a CoinParticlesProvider");
  }
  return context;
};
