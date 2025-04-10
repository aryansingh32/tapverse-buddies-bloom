
import { useState, useEffect, useCallback } from "react";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Volume2, VolumeX, Vibrate, Music } from "lucide-react";
import { Toast } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";

// Define available beat patterns
const BEAT_PATTERNS = [
  {
    id: "basic",
    name: "Basic Beat",
    pattern: [800, 400, 400, 800],
    difficulty: 1,
    multiplier: 1.2
  },
  {
    id: "medium",
    name: "Medium Beat",
    pattern: [600, 300, 300, 600, 300, 300],
    difficulty: 2,
    multiplier: 1.5
  },
  {
    id: "complex",
    name: "Complex Beat",
    pattern: [400, 200, 200, 400, 200, 200, 400],
    difficulty: 3,
    multiplier: 2
  }
];

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

// Create audio elements for different sounds
let tapSound: HTMLAudioElement | null = null;
let perfectSound: HTMLAudioElement | null = null;
let backgroundMusic: HTMLAudioElement | null = null;

// Initialize sounds if in browser environment
if (typeof window !== "undefined") {
  tapSound = new Audio("/sounds/tap.mp3");
  perfectSound = new Audio("/sounds/perfect.mp3");
  backgroundMusic = new Audio("/sounds/background-beat.mp3");
  backgroundMusic.loop = true;
}

export function RhythmMode() {
  const { gameState } = useGame();
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
      if (isSoundEnabled && backgroundMusic) {
        backgroundMusic.play();
      }
    } else {
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
    }
  }, [isRhythmMode, isSoundEnabled]);

  // Toggle sound effects on/off
  const toggleSound = useCallback(() => {
    const newState = !isSoundEnabled;
    setIsSoundEnabled(newState);
    
    if (newState && isRhythmMode && backgroundMusic) {
      backgroundMusic.play();
    } else if (backgroundMusic) {
      backgroundMusic.pause();
    }
    
    // Test sound when enabling
    if (newState && tapSound) {
      tapSound.play();
    }
  }, [isSoundEnabled, isRhythmMode]);

  // Toggle vibration feedback on/off
  const toggleVibration = useCallback(() => {
    const newState = !isVibrationEnabled;
    setIsVibrationEnabled(newState);
    
    // Test vibration when enabling
    if (newState && "vibrate" in navigator) {
      navigator.vibrate(100);
    }
  }, [isVibrationEnabled]);

  // Play the beat pattern
  useEffect(() => {
    let beatInterval: NodeJS.Timeout;
    let beatIndex = 0;
    
    if (isRhythmMode && isSoundEnabled) {
      setIsPlaying(true);
      
      // Start the beat sequence
      const playNextBeat = () => {
        const now = Date.now();
        setLastBeatTime(now);
        
        if (tapSound) {
          tapSound.currentTime = 0;
          tapSound.play();
        }
        
        if (isVibrationEnabled && "vibrate" in navigator) {
          navigator.vibrate(50);
        }
        
        beatIndex = (beatIndex + 1) % currentPattern.pattern.length;
        const nextBeatDelay = currentPattern.pattern[beatIndex];
        
        // Visualize the beat progress
        setBeatProgress(100);
        const decrementProgress = () => {
          setBeatProgress((prev) => {
            if (prev <= 0) return 0;
            return prev - 5;
          });
        };
        
        const progressInterval = setInterval(decrementProgress, nextBeatDelay / 20);
        
        setTimeout(() => {
          clearInterval(progressInterval);
          playNextBeat();
        }, nextBeatDelay);
      };
      
      playNextBeat();
      return () => {
        clearInterval(beatInterval);
        setIsPlaying(false);
      };
    }
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
        if (perfectSound && isSoundEnabled) {
          perfectSound.currentTime = 0;
          perfectSound.play();
        }
        
        if (isVibrationEnabled && "vibrate" in navigator) {
          navigator.vibrate([50, 50, 100]);
        }
        
        return { matched: true, multiplier: currentPattern.multiplier * 1.5 };
      } else if (isGood) {
        // Good hit
        if (isVibrationEnabled && "vibrate" in navigator) {
          navigator.vibrate(100);
        }
        
        return { matched: true, multiplier: currentPattern.multiplier };
      }
      
      // Miss
      return { matched: false, multiplier: 1 };
    },
    [isRhythmMode, isPlaying, lastBeatTime, currentPattern, isSoundEnabled, isVibrationEnabled]
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-purple/10 mb-4">
      <h3 className="text-lg font-bold gradient-text mb-3">Rhythm Mode</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Music className="h-5 w-5 text-purple" />
            <Label htmlFor="rhythm-mode" className="text-sm font-medium">Rhythm Mode</Label>
          </div>
          <Switch 
            id="rhythm-mode" 
            checked={isRhythmMode} 
            onCheckedChange={toggleRhythmMode} 
          />
        </div>
        
        {isRhythmMode && (
          <>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple transition-all duration-100" 
                style={{ width: `${beatProgress}%` }}
              ></div>
            </div>
            
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
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isSoundEnabled ? 
                  <Volume2 className="h-5 w-5 text-teal" /> : 
                  <VolumeX className="h-5 w-5 text-gray-400" />
                }
                <Label htmlFor="sound-toggle" className="text-sm font-medium">Sound</Label>
              </div>
              <Switch 
                id="sound-toggle" 
                checked={isSoundEnabled} 
                onCheckedChange={toggleSound} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Vibrate className="h-5 w-5 text-orange-500" />
                <Label htmlFor="vibration-toggle" className="text-sm font-medium">Vibration</Label>
              </div>
              <Switch 
                id="vibration-toggle" 
                checked={isVibrationEnabled} 
                onCheckedChange={toggleVibration} 
              />
            </div>
            
            <div className="text-xs text-gray-500 italic mt-2">
              Current Multiplier: x{currentPattern.multiplier.toFixed(1)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Custom hook to expose rhythm mode functionality
export function useRhythmMode(): RhythmContextProps {
  // Implementation would normally be here, but for simplicity
  // we're using default values since this is just a demonstration
  const [isRhythmMode, setIsRhythmMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(false);
  const [currentPattern, setCurrentPattern] = useState(BEAT_PATTERNS[0]);
  const [lastBeatTime, setLastBeatTime] = useState(0);
  const [beatProgress, setBeatProgress] = useState(0);

  const toggleRhythmMode = () => setIsRhythmMode(!isRhythmMode);
  const toggleSound = () => setIsSoundEnabled(!isSoundEnabled);
  const toggleVibration = () => setIsVibrationEnabled(!isVibrationEnabled);
  
  const checkTapRhythm = (timestamp: number) => {
    return { matched: false, multiplier: 1 };
  };

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
