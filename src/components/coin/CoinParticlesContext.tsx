
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
  scale?: number;
}

interface CoinParticlesContextType {
  createCoinBurst: (x: number, y: number, count?: number) => void;
  createFloatingNumber: (x: number, y: number, value: string) => void;
  createConfetti: (count?: number) => void;
  createLevelUpAnimation: (level: number) => void;
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
          size: p.type === 'number' ? p.size : Math.max(p.size - 0.1, 0),
          scale: p.scale ? p.scale * 0.99 : 1
        }))
      );
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [particles]);

  // Create a burst of coin particles
  const createCoinBurst = (x: number, y: number, count = 10) => {
    const newParticles: Particle[] = [];
    const particleTypes = ['coin', 'sparkle', 'star'];
    const colors = ['#ffd700', '#ffb700', '#ff9500', '#ffffff', '#FFD700', '#FFA500', '#FF8C00'];
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 1 + Math.random() * 4;
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
        velocityY: Math.sin(angle) * speed - 3, // stronger initial upward velocity
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: 1.0 + Math.random() * 0.5
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
      velocityX: -0.5 + Math.random(), // slight horizontal movement
      velocityY: -2,
      color: value.includes('+') 
        ? value.includes('COMBO') 
          ? '#9b87f5' // purple for combo
          : '#4fd1c5' // teal for regular coins
        : '#ff9500' // orange for other text
    };
    
    setNextId(nextId + 1);
    setParticles(current => [...current, newParticle]);
  };
  
  // Create confetti explosion for celebrations
  const createConfetti = (count = 100) => {
    const newParticles: Particle[] = [];
    const colors = [
      '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', 
      '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', 
      '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
    ];
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const distance = 10 + Math.random() * 20;
      const speed = 5 + Math.random() * 15;
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      newParticles.push({
        id: nextId + i,
        x,
        y,
        type: Math.random() > 0.7 ? 'star' : 'sparkle',
        size: 8 + Math.random() * 20,
        opacity: 1,
        rotation: Math.random() * 360,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed - 10, // strong upward burst
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: 1.0 + Math.random() * 0.5
      });
    }
    
    setNextId(nextId + count);
    setParticles(current => [...current, ...newParticles]);
    
    // Create DOM-based confetti for better performance with large numbers
    createDOMConfetti();
  };
  
  // Create DOM-based confetti (better for large particle counts)
  const createDOMConfetti = () => {
    const container = document.createElement('div');
    container.className = 'fixed inset-0 pointer-events-none z-50';
    document.body.appendChild(container);
    
    const colors = [
      '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', 
      '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', 
      '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
    ];
    
    // Create 150 DOM-based confetti pieces
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      
      // Random properties
      const size = 5 + Math.floor(Math.random() * 10);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const isCircle = Math.random() > 0.5;
      const startX = 40 + Math.random() * (window.innerWidth - 80);
      const startY = -20 - Math.random() * 100;
      const endX = startX - 100 + Math.random() * 200;
      const endY = window.innerHeight + 100;
      const rotation = Math.random() * 720 - 360;
      const duration = 3 + Math.random() * 3;
      const delay = Math.random() * 0.5;
      
      // Apply styles
      confetti.style.position = 'absolute';
      confetti.style.width = `${size}px`;
      confetti.style.height = isCircle ? `${size}px` : `${size * 0.6}px`;
      confetti.style.backgroundColor = color;
      confetti.style.left = `${startX}px`;
      confetti.style.top = `${startY}px`;
      confetti.style.borderRadius = isCircle ? '50%' : '2px';
      confetti.style.opacity = (0.5 + Math.random() * 0.5).toString();
      confetti.style.animation = `confetti-fall ${duration}s ease-in forwards`;
      confetti.style.animationDelay = `${delay}s`;
      
      // Add keyframes for this specific confetti piece
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        @keyframes confetti-fall {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: ${0.5 + Math.random() * 0.5};
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translate(${endX - startX}px, ${endY}px) rotate(${rotation}deg);
            opacity: 0;
          }
        }
      `;
      
      document.head.appendChild(styleElement);
      container.appendChild(confetti);
      
      // Clean up
      setTimeout(() => {
        confetti.remove();
        styleElement.remove();
      }, (duration + delay) * 1000);
    }
    
    // Clean up the container
    setTimeout(() => {
      container.remove();
    }, 8000);
  };
  
  // Create level up animation
  const createLevelUpAnimation = (level: number) => {
    // Create DOM-based level up animation for better visual impact
    const container = document.createElement('div');
    container.className = 'fixed inset-0 flex items-center justify-center pointer-events-none z-50';
    document.body.appendChild(container);
    
    // Create the level up banner
    const banner = document.createElement('div');
    banner.className = 'bg-gradient-to-r from-purple to-teal px-8 py-4 rounded-lg shadow-lg animate-level-up';
    banner.innerHTML = `
      <h2 class="text-white text-4xl font-bold text-center mb-2">LEVEL UP!</h2>
      <div class="text-white text-6xl font-bold text-center animate-number-bounce">${level}</div>
    `;
    
    container.appendChild(banner);
    
    // Create a glow effect
    const glow = document.createElement('div');
    glow.className = 'absolute inset-0 bg-white opacity-0';
    glow.style.animation = 'level-up-glow 1s ease-out forwards';
    container.appendChild(glow);
    
    // Add keyframes for the glow effect
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes level-up-glow {
        0% {
          opacity: 0;
        }
        30% {
          opacity: 0.3;
        }
        100% {
          opacity: 0;
        }
      }
    `;
    
    document.head.appendChild(styleElement);
    
    // Create some stars and sparkles
    for (let i = 0; i < 30; i++) {
      const star = document.createElement('div');
      const size = 10 + Math.random() * 20;
      const startX = window.innerWidth / 2 - 100 + Math.random() * 200;
      const startY = window.innerHeight / 2;
      
      star.style.position = 'absolute';
      star.style.left = `${startX}px`;
      star.style.top = `${startY}px`;
      star.style.fontSize = `${size}px`;
      star.style.color = ['#FFD700', '#FF9500', '#FF5252'][Math.floor(Math.random() * 3)];
      star.style.opacity = '0';
      star.style.zIndex = '60';
      star.innerHTML = ['✦', '✧', '★', '☆', '✨'][Math.floor(Math.random() * 5)];
      
      // Add animation
      star.style.animation = `level-star ${1 + Math.random() * 2}s ease-out forwards ${Math.random()}s`;
      
      container.appendChild(star);
    }
    
    // Add keyframes for the stars
    styleElement.textContent += `
      @keyframes level-star {
        0% {
          transform: translate(0, 0) scale(0.5);
          opacity: 0;
        }
        20% {
          opacity: 1;
        }
        100% {
          transform: translate(${-100 + Math.random() * 200}px, ${-100 - Math.random() * 100}px) scale(1);
          opacity: 0;
        }
      }
    `;
    
    // Clean up
    setTimeout(() => {
      container.remove();
      styleElement.remove();
    }, 5000);
    
    // Also add some regular particles
    createConfetti(50);
  };

  return (
    <CoinParticlesContext.Provider value={{ 
      particles, 
      createCoinBurst, 
      createFloatingNumber,
      createConfetti,
      createLevelUpAnimation
    }}>
      <div className="coin-particles-container fixed inset-0 pointer-events-none z-30">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              opacity: particle.opacity,
              transform: `rotate(${particle.rotation}deg) scale(${particle.scale || 1})`,
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
              <div className="text-center" style={{ fontSize: `${particle.size}px`, color: particle.color }}>
                {['✦', '✧', '★', '☆', '✨'][Math.floor(Math.random() * 5)]}
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
