
import React from "react";
import { Sparkles, Coins, Music } from "lucide-react";

interface ParticleProps {
  id: number;
  x: number;
  y: number;
  type: "sparkle" | "coin" | "note";
  color: string;
}

export function CoinParticle({ id, x, y, type, color }: ParticleProps) {
  return (
    <div
      key={id}
      className="absolute"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        animation: 'enhanced-coin-bounce 1.5s ease-out forwards, fade-out 1s ease-in forwards',
        zIndex: 10
      }}
    >
      {type === "sparkle" ? (
        <Sparkles className="h-6 w-6" style={{ color }} />
      ) : type === "note" ? (
        <Music className="h-6 w-6" style={{ color }} />
      ) : (
        <Coins className="h-5 w-5" style={{ color }} />
      )}
    </div>
  );
}
