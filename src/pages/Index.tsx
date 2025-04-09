
import { ResourceDisplay } from "@/components/ResourceDisplay";
import { CoinButton } from "@/components/CoinButton";
import { AiBuddy } from "@/components/AiBuddy";
import { OnboardingModal } from "@/components/OnboardingModal";
import { useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { gameState, resetEnergy } = useGame();

  // Animation/sound effects could be added here
  useEffect(() => {
    document.title = "TapVerse - Tap, Collect, Earn!";
  }, []);

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

        <div className="mt-10 mb-5">
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
            <h3 className="font-semibold mb-1 text-sm">Energy Tip</h3>
            <p className="text-xs text-gray-600">
              Your energy regenerates over time. Take short breaks!
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
