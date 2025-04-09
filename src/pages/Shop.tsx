
import { useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { ResourceDisplay } from "@/components/ResourceDisplay";
import { UpgradeCard } from "@/components/UpgradeCard";
import { AiBuddy } from "@/components/AiBuddy";
import { RedeemSection } from "@/components/RedeemSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Rocket, Zap, Sparkles } from "lucide-react";

const Shop = () => {
  const { upgrades } = useGame();
  
  useEffect(() => {
    document.title = "Shop - TapVerse";
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-light-gray py-10 px-4 pb-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center gradient-text mb-2">Shop</h1>
        <p className="text-center text-gray-600 mb-6">Upgrade your tapping power!</p>
        
        <ResourceDisplay />
        
        <Tabs defaultValue="upgrades" className="mt-8">
          <TabsList className="grid w-full grid-cols-3 mb-6 rounded-xl p-1 bg-white shadow-md">
            <TabsTrigger value="upgrades" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple/80 data-[state=active]:to-teal/80 data-[state=active]:text-white">
              <Zap className="w-4 h-4 mr-1" />
              Upgrades
            </TabsTrigger>
            <TabsTrigger value="robots" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple/80 data-[state=active]:to-teal/80 data-[state=active]:text-white">
              <Bot className="w-4 h-4 mr-1" />
              Bots
            </TabsTrigger>
            <TabsTrigger value="redeem" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple/80 data-[state=active]:to-teal/80 data-[state=active]:text-white">
              <Rocket className="w-4 h-4 mr-1" />
              Redeem
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upgrades" className="space-y-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent">Power Upgrades</h2>
            
            <div className="space-y-4">
              {upgrades.map((upgrade) => (
                <UpgradeCard 
                  key={upgrade.id}
                  id={upgrade.id}
                  name={upgrade.name}
                  description={upgrade.description}
                  cost={upgrade.cost}
                  effect={upgrade.effect}
                  value={upgrade.value}
                  owned={upgrade.owned}
                />
              ))}
            </div>
            
            <div className="mt-8 p-5 rounded-xl bg-gradient-to-r from-gold/10 to-pink/10 border border-gold/20">
              <h3 className="font-bold text-amber-700 mb-1 flex items-center">
                <Sparkles className="h-5 w-5 text-gold mr-2" />
                Coming Soon!
              </h3>
              <p className="text-sm text-amber-700">
                New skins, special abilities, and more exciting upgrades are on their way!
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="robots">
            <div className="p-6 rounded-xl bg-gradient-to-r from-purple/10 to-teal/10 border border-purple/20 text-center">
              <Bot className="h-16 w-16 mx-auto text-purple opacity-70 mb-3" />
              <h3 className="font-bold text-lg mb-2">Auto-Tapper Bots</h3>
              <p className="text-sm text-gray-600 mb-4">
                Coming soon! Purchase bots that tap for you even when you're offline.
              </p>
              <div className="bg-white/50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm">Bot Types:</h4>
                <ul className="text-xs text-gray-600 mt-1 space-y-1">
                  <li>🤖 Robo-Tapper: Basic auto-tapper</li>
                  <li>🐱 Cyber-Cat: Energy efficient tapper</li>
                  <li>👾 Space Alien: Collects special bonus coins</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="redeem">
            <RedeemSection />
          </TabsContent>
        </Tabs>
      </div>
      
      <AiBuddy />
    </div>
  );
}

export default Shop;
