
import { useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { AiBuddy } from "@/components/AiBuddy";
import { ResourceDisplay } from "@/components/ResourceDisplay";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle2, Clock, Award, BarChart3 } from "lucide-react";
import { QuestCard } from "@/components/QuestCard";

const Quests = () => {
  const { quests, gameState, claimQuestReward } = useGame();
  
  useEffect(() => {
    document.title = "Quests - TapVerse";
  }, []);
  
  const dailyQuests = quests.filter(quest => quest.type === 'daily');
  const weeklyQuests = quests.filter(quest => quest.type === 'weekly');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-light-gray py-10 px-4 pb-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center gradient-text mb-2">Quests</h1>
        <p className="text-center text-gray-600 mb-6">Complete missions, earn rewards</p>
        
        <ResourceDisplay />
        
        <div className="bg-gradient-to-r from-gold/20 to-pink/20 p-4 rounded-xl mt-6 mb-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-3 shadow-inner">
              <Calendar className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h2 className="font-bold">Daily Streak: {gameState.streakDays} days</h2>
              <p className="text-xs text-gray-700">Keep your streak going to earn bonus rewards!</p>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="daily" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl p-1 bg-white shadow-md">
            <TabsTrigger value="daily" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple/80 data-[state=active]:to-teal/80 data-[state=active]:text-white">
              <Clock className="w-4 h-4 mr-1" />
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple/80 data-[state=active]:to-teal/80 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-1" />
              Weekly
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-4">
            <div className="bg-white rounded-xl p-4 mb-4 shadow border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-purple" />
                  Daily Quests
                </h3>
                <div className="text-xs bg-purple/10 text-purple px-2 py-1 rounded-full">
                  Resets at midnight
                </div>
              </div>
              
              <div className="space-y-3">
                {dailyQuests.map(quest => (
                  <QuestCard 
                    key={quest.id}
                    title={quest.title}
                    description={quest.description}
                    progress={quest.progress}
                    requirement={quest.requirement}
                    rewardCoins={quest.rewardCoins}
                    rewardXp={quest.rewardXp}
                    completed={quest.completed}
                    claimed={quest.progress > quest.requirement}
                    onClaim={() => claimQuestReward(quest.id)}
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple/5 to-teal/5 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">
                Complete all daily quests to earn a streak bonus tomorrow!
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="weekly" className="space-y-4">
            <div className="bg-white rounded-xl p-4 mb-4 shadow border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-purple" />
                  Weekly Quests
                </h3>
                <div className="text-xs bg-purple/10 text-purple px-2 py-1 rounded-full">
                  Resets on Sunday
                </div>
              </div>
              
              <div className="space-y-3">
                {weeklyQuests.map(quest => (
                  <QuestCard 
                    key={quest.id}
                    title={quest.title}
                    description={quest.description}
                    progress={quest.progress}
                    requirement={quest.requirement}
                    rewardCoins={quest.rewardCoins}
                    rewardXp={quest.rewardXp}
                    completed={quest.completed}
                    claimed={quest.progress > quest.requirement}
                    onClaim={() => claimQuestReward(quest.id)}
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gold/10 to-pink/10 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">
                Weekly quests give bigger rewards. Don't miss out!
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-center">
          <div className="flex items-center text-sm text-gray-500">
            <Award className="h-4 w-4 mr-1 text-purple" />
            <span>Check your profile for achievement badges!</span>
          </div>
        </div>
      </div>
      
      <AiBuddy />
    </div>
  );
};

export default Quests;
