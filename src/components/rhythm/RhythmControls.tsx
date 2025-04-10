
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Volume2, VolumeX, Vibrate } from "lucide-react";

interface RhythmControlsProps {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  isVibrationEnabled: boolean;
  toggleVibration: () => void;
}

export function RhythmControls({ 
  isSoundEnabled, 
  toggleSound, 
  isVibrationEnabled, 
  toggleVibration 
}: RhythmControlsProps) {
  return (
    <>
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
    </>
  );
}
