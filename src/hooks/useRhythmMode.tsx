
import { useState, useEffect, useCallback } from "react";
import { BEAT_PATTERNS } from "@/constants/beatPatterns";
import { sounds, playSound, pauseSound } from "@/utils/audioUtils";
import { toast } from "@/hooks/use-toast";

// Define the rhythm context to be used by the app
export interface RhythmContextProps {
  isRhythmMode: boolean;
  toggleRhythmMode: () => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  isVibrationEnabled: boolean;
  toggleVibration: () => void;
  currentPattern: typeof BEAT_PATTERNS[0];
  setCurrentPattern: (pattern: typeof BEAT_PATTERNS[0]) => void;
  checkTapRhythm: (timestamp: number) => { matched: boolean; multiplier: number };
  lastBeatTime: number;
  beatProgress: number;
}

export function useRhythmMode(): RhythmContextProps {
  const [isRhythmMode, setIsRhythmMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(false);
  const [currentPattern, setCurrentPattern] = useState(BEAT_PATTERNS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatProgress, setBeatProgress] = useState(0);
  const [lastBeatTime, setLastBeatTime] = useState(0);

  // Toggle rhythm mode on/off
  const toggleRhythmMode = useCallback(() => {
    const newState = !isRhythmMode;
    setIsRhythmMode(newState);
    
    if (newState) {
      toast({
        title: "Rhythm Mode Activated!",
        description: "Tap in rhythm with the beat for bonus coins!",
      });
      if (isSoundEnabled && sounds.backgroundMusic) {
        playSound(sounds.backgroundMusic);
      }
    } else {
      if (sounds.backgroundMusic) {
        pauseSound(sounds.backgroundMusic);
      }
    }
  }, [isRhythmMode, isSoundEnabled]);

  // Toggle sound effects on/off
  const toggleSound = useCallback(() => {
    const newState = !isSoundEnabled;
    setIsSoundEnabled(newState);
    
    if (newState && isRhythmMode && sounds.backgroundMusic) {
      playSound(sounds.backgroundMusic);
    } else if (sounds.backgroundMusic) {
      pauseSound(sounds.backgroundMusic);
    }
    
    // Test sound when enabling
    if (newState && sounds.tapSound) {
      playSound(sounds.tapSound);
    }
  }, [isSoundEnabled, isRhythmMode]);

  // Toggle vibration feedback on/off
  const toggleVibration = useCallback(() => {
    const newState = !isVibrationEnabled;
    setIsVibrationEnabled(newState);
    
    // Test vibration when enabling
    if (newState && typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(100);
      } catch (error) {
        console.warn("Vibration API error:", error);
      }
    }
  }, [isVibrationEnabled]);

  // Play the beat pattern
  useEffect(() => {
    let beatInterval: NodeJS.Timeout | null = null;
    let progressInterval: NodeJS.Timeout | null = null;
    let beatIndex = 0;
    
    if (isRhythmMode && isSoundEnabled) {
      setIsPlaying(true);
      
      // Start the beat sequence
      const playNextBeat = () => {
        const now = Date.now();
        setLastBeatTime(now);
        
        if (sounds.tapSound) {
          playSound(sounds.tapSound);
        }
        
        if (isVibrationEnabled && typeof navigator !== "undefined" && "vibrate" in navigator) {
          try {
            navigator.vibrate(50);
          } catch (error) {
            console.warn("Vibration API error:", error);
          }
        }
        
        beatIndex = (beatIndex + 1) % currentPattern.pattern.length;
        const nextBeatDelay = currentPattern.pattern[beatIndex];
        
        // Visualize the beat progress
        setBeatProgress(100);
        
        if (progressInterval) clearInterval(progressInterval);
        
        progressInterval = setInterval(() => {
          setBeatProgress((prev) => {
            if (prev <= 0) return 0;
            return prev - 5;
          });
        }, nextBeatDelay / 20);
        
        beatInterval = setTimeout(() => {
          playNextBeat();
        }, nextBeatDelay);
      };
      
      playNextBeat();
      
      return () => {
        if (beatInterval) clearTimeout(beatInterval);
        if (progressInterval) clearInterval(progressInterval);
        setIsPlaying(false);
      };
    }
    
    return () => {
      if (beatInterval) clearTimeout(beatInterval);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isRhythmMode, isSoundEnabled, isVibrationEnabled, currentPattern]);

  // Check if a tap matches the rhythm
  const checkTapRhythm = useCallback(
    (timestamp: number): { matched: boolean; multiplier: number } => {
      if (!isRhythmMode || !isPlaying) {
        return { matched: false, multiplier: 1 };
      }
      
      // Calculate how close the tap was to the beat
      const timeSinceLastBeat = timestamp - lastBeatTime;
      const currentBeatDuration = currentPattern.pattern[0]; // Simplification
      const beatWindow = currentBeatDuration / 3; // Timing window for a "good" tap
      
      // Check if tap is within the "perfect" window (tighter than "good")
      const isPerfect = timeSinceLastBeat < beatWindow / 2;
      const isGood = timeSinceLastBeat < beatWindow;
      
      if (isPerfect) {
        // Perfect hit!
        if (sounds.perfectSound && isSoundEnabled) {
          playSound(sounds.perfectSound);
        }
        
        if (isVibrationEnabled && typeof navigator !== "undefined" && "vibrate" in navigator) {
          try {
            navigator.vibrate([50, 50, 100]);
          } catch (error) {
            console.warn("Vibration API error:", error);
          }
        }
        
        return { matched: true, multiplier: currentPattern.multiplier * 1.5 };
      } else if (isGood) {
        // Good hit
        if (isVibrationEnabled && typeof navigator !== "undefined" && "vibrate" in navigator) {
          try {
            navigator.vibrate(100);
          } catch (error) {
            console.warn("Vibration API error:", error);
          }
        }
        
        return { matched: true, multiplier: currentPattern.multiplier };
      }
      
      // Miss
      return { matched: false, multiplier: 1 };
    },
    [isRhythmMode, isPlaying, lastBeatTime, currentPattern, isSoundEnabled, isVibrationEnabled]
  );

  return {
    isRhythmMode,
    toggleRhythmMode,
    isSoundEnabled,
    toggleSound,
    isVibrationEnabled,
    toggleVibration,
    currentPattern,
    setCurrentPattern,
    checkTapRhythm,
    lastBeatTime,
    beatProgress
  };
}
