
import React from "react";

interface BeatProgressProps {
  beatProgress: number;
}

export function BeatProgress({ beatProgress }: BeatProgressProps) {
  return (
    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-purple transition-all duration-100" 
        style={{ width: `${beatProgress}%` }}
      ></div>
    </div>
  );
}
