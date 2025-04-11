
import { useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { AiBuddy } from "@/components/AiBuddy";
import { ResourceDisplay } from "@/components/ResourceDisplay";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet, 
  User, 
  Award, 
  Calendar, 
  BarChart4, 
  Sparkles,
  TrendingUp,
  Settings,
  Music,
  Volume2,
  Vibrate
} from "lucide-react";
import { BadgeCard } from "@/components/BadgeCard";
import { useRhythmMode } from "@/hooks/useRhythmMode";
import { BEAT_PATTERNS } from "@/constants/beatPatterns";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const { gameState, aiName } = useGame();
  const {
    isRhythmMode,
    toggleRhythmMode,
    isSoundEnabled,
    toggleSound,
    isVibrationEnabled,
    toggleVibration,
    currentPattern,
    setCurrentPattern
  } = useRhythmMode();
  
  useEffect(() => {
    document.title = "Profile - TapVerse";
  }, []);
  
  const handleReset = () => {
    if (confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
      localStorage.removeItem("tapverse-game-state");
      localStorage.removeItem("tapverse-upgrades");
      localStorage.removeItem("tapverse-quests");
      localStorage.removeItem("tapverse-chapters");
      toast({
        title: "Progress Reset",
        description: "Your game has been reset. Refresh the page to start over.",
      });
    }
  };
  
  // Add safe default values when using gameState properties
  const streakDays = gameState?.streakDays || 0;
  const totalTaps = gameState?.totalTaps || 0;
  const level = gameState?.level || 1;
  
  const badges = [
    { id: "beginner", name: "Beginner Tapper", description: "Started your tapping journey", unlocked: true },
    { id: "streak-3", name: "3-Day Streak", description: "Played 3 days in a row", unlocked: streakDays >= 3 },
    { id: "streak-7", name: "7-Day Streak", description: "Played 7 days in a row", unlocked: streakDays >= 7 },
    { id: "taps-1000", name: "Tap Master", description: "Reached 1,000 total taps", unlocked: totalTaps >= 1000 },
    { id: "taps-10000", name: "Tap Legend", description: "Reached 10,000 total taps", unlocked: totalTaps >= 10000 },
    { id: "level-5", name: "Novice Explorer", description: "Reached level 5", unlocked: level >= 5 },
    { id: "level-10", name: "Expert Explorer", description: "Reached level 10", unlocked: level >= 10 },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-light-gray py-10 px-4 pb-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center gradient-text mb-2">Profile</h1>
        <p className="text-center text-gray-600 mb-6">Your TapVerse journey</p>
        
        <ResourceDisplay />
        
        <Tabs defaultValue="profile" className="mt-8">
          <TabsList className="grid w-full grid-cols-4 mb-6 rounded-xl p-1 bg-white shadow-md">
            <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple/80 data-[state=active]:to-teal/80 data-[state=active]:text-white">
              <User className="w-4 h-4 mr-1" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="wallet" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple/80 data-[state=active]:to-teal/80 data-[state=active]:text-white">
              <Wallet className="w-4 h-4 mr-1" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="badges" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple/80 data-[state=active]:to-teal/80 data-[state=active]:text-white">
              <Award className="w-4 h-4 mr-1" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple/80 data-[state=active]:to-teal/80 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-md border border-purple/10">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple to-blue-400 flex items-center justify-center mr-4">
                  <span className="text-white text-2xl font-bold">
                    {level}
                  </span>
                </div>
                <div>
                  <h2 className="font-bold text-xl">TapVerse Player</h2>
                  <div className="flex items-center">
                    <p className="text-gray-600 text-sm">Level {level}</p>
                    <div className="ml-2 text-xs bg-purple/10 text-purple px-2 py-0.5 rounded-full">
                      {(gameState?.experience || 0) % 100}/100 XP
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Total Taps</p>
                  <p className="font-bold text-lg">{(totalTaps || 0).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Tap Power</p>
                  <p className="font-bold text-lg">{(gameState?.tapPower || 1).toFixed(1)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Multiplier</p>
                  <p className="font-bold text-lg">x{(gameState?.coinMultiplier || 1).toFixed(1)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Day Streak</p>
                  <p className="font-bold text-lg">{streakDays}</p>
                </div>
              </div>
              
              <div className="bg-purple/5 p-4 rounded-xl mb-6">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-blue-400 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">{(aiName || "AI").charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold">{aiName || "AI Buddy"}</h3>
                    <p className="text-xs text-gray-600">Your AI buddy</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  "{(aiName || "Your buddy")} has been with you through {(totalTaps || 0).toLocaleString()} taps and {(Math.floor(gameState?.coins || 0)).toLocaleString()} coins!"
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="wallet">
            <div className="bg-white rounded-xl p-6 shadow-md border border-purple/10">
              <div className="flex items-center mb-6">
                <Wallet className="w-10 h-10 text-purple mr-4" />
                <h2 className="text-xl font-bold">Your Wallet</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple/10 to-teal/10 rounded-xl p-4 border border-purple/20">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-600">Current Balance</p>
                    <Sparkles className="h-4 w-4 text-gold" />
                  </div>
                  <p className="text-2xl font-bold">{Math.floor(gameState?.coins || 0).toLocaleString()} coins</p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-xs text-gray-500">Multiplier applied</p>
                    <p className="text-sm font-medium">x{(gameState?.coinMultiplier || 1).toFixed(1)}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-4 w-4 mr-2 text-purple" />
                    <p className="font-medium">Lifetime Stats</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="bg-white p-3 rounded border border-gray-100">
                      <p className="text-xs text-gray-500">Total Earned</p>
                      <p className="font-medium">{((totalTaps || 0) * (gameState?.tapPower || 1)).toLocaleString()} coins</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-100">
                      <p className="text-xs text-gray-500">Drop Events Joined</p>
                      <p className="font-medium">{gameState?.dropEventsJoined || 0}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-100">
                      <p className="text-xs text-gray-500">Rewards Redeemed</p>
                      <p className="font-medium">{gameState?.dropEventsRedeemed || 0}</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-gray-100">
                      <p className="text-xs text-gray-500">Conversion Rate</p>
                      <p className="font-medium">Coming soon</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-gold/10 to-pink/10 p-4 rounded-lg border border-gold/20">
                  <p className="text-sm font-semibold flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gold" />
                    Next Drop Event
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Stay tuned for upcoming events where you can redeem your coins for real rewards!
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="badges">
            <div className="bg-white rounded-xl p-6 shadow-md border border-purple/10">
              <div className="flex items-center mb-6">
                <Award className="w-10 h-10 text-purple mr-4" />
                <div>
                  <h2 className="text-xl font-bold">Achievements</h2>
                  <p className="text-sm text-gray-600">Unlocked {badges.filter(b => b.unlocked).length} of {badges.length}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {badges.map(badge => (
                  <BadgeCard 
                    key={badge.id}
                    name={badge.name}
                    description={badge.description}
                    unlocked={badge.unlocked}
                  />
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-purple/5 rounded-lg">
                <p className="text-sm text-center text-gray-600">
                  Keep tapping to unlock more achievements!
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="bg-white rounded-xl p-6 shadow-md border border-purple/10">
              <div className="flex items-center mb-6">
                <Settings className="w-10 h-10 text-purple mr-4" />
                <h2 className="text-xl font-bold">Settings</h2>
              </div>
              
              {/* Rhythm Mode Settings */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Rhythm Mode</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Music className="w-5 h-5 text-purple mr-3"/>
                      <div>
                        <p className="font-medium">Rhythm Mode</p>
                        <p className="text-xs text-gray-500">Tap to the beat for bonus coins</p>
                      </div>
                    </div>
                    <Switch
                      checked={isRhythmMode}
                      onCheckedChange={toggleRhythmMode}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Volume2 className="w-5 h-5 text-purple mr-3"/>
                      <div>
                        <p className="font-medium">Sound Effects</p>
                        <p className="text-xs text-gray-500">Play sounds with rhythm</p>
                      </div>
                    </div>
                    <Switch
                      checked={isSoundEnabled}
                      onCheckedChange={toggleSound}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Vibrate className="w-5 h-5 text-purple mr-3"/>
                      <div>
                        <p className="font-medium">Vibration</p>
                        <p className="text-xs text-gray-500">Feel the rhythm</p>
                      </div>
                    </div>
                    <Switch
                      checked={isVibrationEnabled}
                      onCheckedChange={toggleVibration}
                    />
                  </div>
                  
                  <div className="pt-2">
                    <p className="font-medium mb-2">Beat Patterns</p>
                    <div className="grid grid-cols-2 gap-3">
                      {BEAT_PATTERNS.map((pattern, index) => (
                        <Button
                          key={index}
                          variant={currentPattern.name === pattern.name ? "default" : "outline"}
                          className={`justify-start ${currentPattern.name === pattern.name ? 'bg-purple text-white' : 'border-purple/20 text-gray-700'}`}
                          onClick={() => setCurrentPattern(pattern)}
                        >
                          <span className="mr-2">{pattern.name}</span>
                          <span className="text-xs">x{pattern.multiplier}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium mb-3">Game Settings</h3>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={handleReset}
                  >
                    Reset Progress
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">TapVerse v1.0</p>
        </div>
      </div>
      
      <AiBuddy />
    </div>
  );
};

export default Profile;
