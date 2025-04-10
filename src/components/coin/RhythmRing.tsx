
import React, { useRef, useEffect } from "react";

interface RhythmRingProps {
  isRhythmMode: boolean;
  beatProgress: number;
}

export function RhythmRing({ isRhythmMode, beatProgress }: RhythmRingProps) {
  const rhythmRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRhythmMode && rhythmRingRef.current) {
      rhythmRingRef.current.style.transform = `scale(${0.8 + beatProgress * 0.004})`;
      rhythmRingRef.current.style.opacity = `${beatProgress * 0.01}`;
    }
  }, [beatProgress, isRhythmMode]);

  if (!isRhythmMode) return null;

  return (
    <div 
      ref={rhythmRingRef}
      className="absolute w-48 h-48 rounded-full border-4 border-purple opacity-50 transition-all duration-100"
    ></div>
  );
}
