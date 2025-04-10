
import { ResourceDisplay } from "@/components/ResourceDisplay";
import { CoinButton } from "@/components/CoinButton";
import { AiBuddy } from "@/components/AiBuddy";
import { OnboardingModal } from "@/components/OnboardingModal";
import { RhythmMode } from "@/components/RhythmMode";
import { useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Zap, Star, Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const { gameState, resetEnergy } = useGame();

  // Animation/sound effects could be added here
  useEffect(() => {
    document.title = "TapVerse - Tap, Collect, Earn!";
  }, []);

  // Calculate XP percentage for the progress bar
  const xpNeededForNextLevel = 100; // Simplified level formula from GameContext
  const currentLevelXp = gameState.experience % xpNeededForNextLevel;
  const xpPercentage = (currentLevelXp / xpNeededForNextLevel) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-light-gray py-10 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center gradient-text mb-2">
          TapVerse
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Tap to collect coins and unlock rewards!
        </p>

        <ResourceDisplay />

        {/* XP Progress Bar */}
        <div className="mt-6 bg-white p-4 rounded-xl shadow-md border border-purple/10">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-gold mr-2" />
              <span className="text-sm font-medium">Level {gameState.level}</span>
            </div>
            <span className="text-xs text-gray-500">
              {currentLevelXp}/{xpNeededForNextLevel} XP
            </span>
          </div>
          <Progress value={xpPercentage} className="h-2" />
        </div>

        {/* Tap Streak Meter */}
        <div className="mt-4 bg-white p-4 rounded-xl shadow-md border border-purple/10">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Timer className="h-5 w-5 text-orange-500 mr-2" />
              <span className="text-sm font-medium">Daily Streak</span>
            </div>
            <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-0.5 rounded-full text-xs">
              {gameState.streakDays} days
            </div>
          </div>
          <div className="flex justify-between mt-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div 
                key={day} 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs
                  ${day <= gameState.streakDays ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Rhythm Mode Component */}
        <RhythmMode />

        {/* Boost Buttons */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-16 border-purple/20 hover:bg-purple/5"
          >
            <Zap className="h-5 w-5 text-purple mb-1" />
            <span className="text-xs">Power Tap</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-16 border-gold/20 hover:bg-gold/5"
          >
            <Star className="h-5 w-5 text-gold mb-1" />
            <span className="text-xs">Double Coins</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center h-16 border-teal/20 hover:bg-teal/5"
          >
            <Timer className="h-5 w-5 text-teal mb-1" />
            <span className="text-xs">Auto-Tap</span>
          </Button>
        </div>

        <div className="mt-6 mb-5">
          <CoinButton />
        </div>

        {/* Current stats */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-600">
            {gameState.energy > 0 ? (
              <>
                You earn <span className="font-bold text-purple">{gameState.tapPower.toFixed(1)}</span> coin
                {gameState.tapPower !== 1 && "s"} per tap
              </>
            ) : (
              <>
                Out of energy! <Button onClick={resetEnergy} size="sm" variant="outline">Refill Energy</Button>
              </>
            )}
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-4 mb-20">
          <div className="bg-white p-4 rounded-xl shadow-md border border-purple/10">
            <h3 className="font-semibold mb-1 text-sm">Power Up!</h3>
            <p className="text-xs text-gray-600">
              Visit the shop to upgrade your tapping abilities!
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-purple/10">
            <h3 className="font-semibold mb-1 text-sm">Rhythm Tip</h3>
            <p className="text-xs text-gray-600">
              Tap in rhythm with the beat to earn bonus coins!
            </p>
          </div>
        </div>
      </div>

      <AiBuddy />
      <OnboardingModal />
    </div>
  );
};

export default Index;
