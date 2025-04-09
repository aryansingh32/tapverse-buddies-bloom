
import { useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { AiBuddy } from "@/components/AiBuddy";
import { ResourceDisplay } from "@/components/ResourceDisplay";
import { Bot, MessageSquare, Zap, Heart, Star, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Buddy = () => {
  const { gameState, aiName, showNewMessage } = useGame();
  const [animateBot, setAnimateBot] = useState(false);
  
  useEffect(() => {
    document.title = "AI Buddy - TapVerse";
  }, []);
  
  const handleInteract = () => {
    setAnimateBot(true);
    showNewMessage();
    setTimeout(() => setAnimateBot(false), 1000);
  };
  
  // Buddy states based on game progress
  const getBuddyMood = () => {
    if (gameState.energy < gameState.maxEnergy * 0.2) return "sleepy";
    if (gameState.coins > 1000) return "excited";
    return "happy";
  };
  
  const buddyMood = getBuddyMood();
  const buddyLevel = gameState.aiLevel;
  
  // Placeholder for buddy skills (would be more dynamic in full implementation)
  const buddySkills = [
    { name: "Coin Boost", level: buddyLevel >= 2 ? 1 : 0, maxLevel: 5, effect: "+5% coins per tap" },
    { name: "Energy Regen", level: buddyLevel >= 3 ? 1 : 0, maxLevel: 5, effect: "+10% energy regen" },
    { name: "Auto-Tap", level: buddyLevel >= 5 ? 1 : 0, maxLevel: 3, effect: "1 tap every 5 seconds" },
    { name: "Fortune", level: 0, maxLevel: 3, effect: "Better daily rewards" },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-light-gray py-10 px-4 pb-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center gradient-text mb-2">Your Buddy</h1>
        <p className="text-center text-gray-600 mb-6">{aiName} is here to help you!</p>
        
        <ResourceDisplay />
        
        <div className="mt-8 bg-white rounded-xl p-4 shadow-md border border-purple/10">
          <div className="flex flex-col items-center">
            <div 
              className={`w-24 h-24 rounded-full bg-gradient-to-r ${
                buddyMood === 'happy' ? 'from-purple to-teal' :
                buddyMood === 'excited' ? 'from-pink-500 to-orange-400' :
                'from-blue-400 to-indigo-500'
              } flex items-center justify-center mb-4 transition-transform duration-500 ${animateBot ? 'scale-110' : ''}`}
            >
              <Bot className="h-12 w-12 text-white" />
            </div>
            
            <h2 className="text-xl font-bold">{aiName}</h2>
            <div className="flex items-center mt-1 mb-4">
              <Badge className="bg-purple text-white mr-2">Level {buddyLevel}</Badge>
              <span className="text-sm text-gray-600">
                {buddyMood === 'happy' && 'Happy 😊'}
                {buddyMood === 'excited' && 'Excited 🤩'}
                {buddyMood === 'sleepy' && 'Sleepy 😴'}
              </span>
            </div>
            
            <div className="w-full mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Buddy XP</span>
                <span>{buddyLevel * 100}/500 XP</span>
              </div>
              <Progress value={(buddyLevel * 100) / 500 * 100} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-2 w-full mb-6">
              <Button 
                variant="outline" 
                className="flex items-center justify-center border-purple/20 text-purple hover:bg-purple/5" 
                onClick={handleInteract}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Talk
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-center border-teal/20 text-teal hover:bg-teal/5" 
                onClick={handleInteract}
              >
                <Heart className="mr-2 h-4 w-4" />
                Bond
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="skills" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
            </TabsList>
            
            <TabsContent value="skills" className="mt-4">
              <div className="space-y-4">
                {buddySkills.map((skill, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Zap className={`h-4 w-4 mr-2 ${skill.level > 0 ? 'text-purple' : 'text-gray-400'}`} />
                        <span className={`font-medium ${skill.level > 0 ? 'text-gray-800' : 'text-gray-500'}`}>{skill.name}</span>
                      </div>
                      <div className="flex items-center">
                        {[...Array(skill.maxLevel)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`h-3 w-3 ${i < skill.level ? 'text-gold fill-gold' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{skill.effect}</p>
                    {skill.level === 0 && (
                      <p className="text-xs text-purple mt-1">Unlocks at buddy level {index + 2}</p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="customize" className="mt-4">
              <div className="text-center py-4">
                <Settings className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">Buddy customization coming soon!</p>
                <p className="text-xs text-gray-400">
                  Unlock different buddy skins, voices, and personalities as you level up.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Buddy;

// Import Badge component at the top
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs ${className || ''}`}>
      {children}
    </span>
  );
}
