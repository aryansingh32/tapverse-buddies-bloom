
import React from "react";
import { Coins } from "lucide-react";

interface FloatingTextProps {
  value: string;
  visible: boolean;
}

export function CoinFloatingText({ value, visible }: FloatingTextProps) {
  return (
    <div className={`absolute -top-12 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple to-teal transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {value} <Coins className="h-4 w-4 inline mb-1 text-gold" />
    </div>
  );
}

interface ComboCounterProps {
  combo: number;
}

export function ComboCounter({ combo }: ComboCounterProps) {
  if (combo <= 2) return null;
  
  return (
    <div className="absolute -top-20 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
      {combo}x Combo!
    </div>
  );
}
