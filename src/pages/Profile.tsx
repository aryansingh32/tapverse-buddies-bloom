
import { useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { AiBuddy } from "@/components/AiBuddy";
import { ResourceDisplay } from "@/components/ResourceDisplay";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Profile = () => {
  const { gameState, aiName } = useGame();
  
  useEffect(() => {
    document.title = "Profile - TapVerse";
  }, []);
  
  const handleReset = () => {
    if (confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
      localStorage.removeItem("tapverse-game-state");
      localStorage.removeItem("tapverse-upgrades");
      toast({
        title: "Progress Reset",
        description: "Your game has been reset. Refresh the page to start over.",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-light-gray py-10 px-4 pb-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center gradient-text mb-2">Profile</h1>
        <p className="text-center text-gray-600 mb-6">Your TapVerse journey</p>
        
        <ResourceDisplay />
        
        <div className="mt-8 bg-white rounded-xl p-6 shadow-md border border-purple/10">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple to-blue-400 flex items-center justify-center mr-4">
              <span className="text-white text-2xl font-bold">
                {gameState.coins > 0 ? Math.floor(Math.log10(gameState.coins)) + 1 : 1}
              </span>
            </div>
            <div>
              <h2 className="font-bold text-xl">TapVerse Player</h2>
              <p className="text-gray-600 text-sm">Level {Math.max(1, Math.floor(gameState.coins / 100))}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Coins</p>
              <p className="font-bold text-lg">{Math.floor(gameState.coins)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Tap Power</p>
              <p className="font-bold text-lg">{gameState.tapPower.toFixed(1)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Multiplier</p>
              <p className="font-bold text-lg">x{gameState.coinMultiplier.toFixed(1)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Max Energy</p>
              <p className="font-bold text-lg">{gameState.maxEnergy}</p>
            </div>
          </div>
          
          <div className="bg-purple/5 p-4 rounded-xl mb-6">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-blue-400 flex items-center justify-center mr-3">
                <span className="text-white font-bold">{aiName.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-bold">{aiName}</h3>
                <p className="text-xs text-gray-600">Your AI buddy</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              "{aiName} has been with you through {Math.floor(gameState.coins)} coins and counting!"
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Settings</h3>
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleReset}
            >
              Reset Progress
            </Button>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">TapVerse v1.0</p>
        </div>
      </div>
      
      <AiBuddy />
    </div>
  );
};

export default Profile;
