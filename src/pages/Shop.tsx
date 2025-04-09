
import { useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { ResourceDisplay } from "@/components/ResourceDisplay";
import { UpgradeCard } from "@/components/UpgradeCard";
import { AiBuddy } from "@/components/AiBuddy";

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
        
        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-semibold">Upgrades</h2>
          
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
          
          <div className="mt-8 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <h3 className="font-bold text-amber-700 mb-1">Coming Soon!</h3>
            <p className="text-sm text-amber-700">
              New skins, special abilities, and more exciting upgrades are on their way!
            </p>
          </div>
        </div>
      </div>
      
      <AiBuddy />
    </div>
  );
};

export default Shop;
