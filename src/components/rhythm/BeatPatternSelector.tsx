
import React from "react";
import { Button } from "@/components/ui/button";
import { BEAT_PATTERNS } from "@/constants/beatPatterns";

interface BeatPatternSelectorProps {
  currentPattern: typeof BEAT_PATTERNS[0];
  setCurrentPattern: (pattern: typeof BEAT_PATTERNS[0]) => void;
}

export function BeatPatternSelector({ 
  currentPattern, 
  setCurrentPattern 
}: BeatPatternSelectorProps) {
  return (
    <div className="flex justify-between">
      {BEAT_PATTERNS.map((pattern) => (
        <Button
          key={pattern.id}
          variant={currentPattern.id === pattern.id ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPattern(pattern)}
          className={currentPattern.id === pattern.id ? "bg-purple hover:bg-purple/90" : ""}
        >
          {pattern.name}
        </Button>
      ))}
    </div>
  );
}
