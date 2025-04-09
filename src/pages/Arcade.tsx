
import { useEffect, useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { AiBuddy } from "@/components/AiBuddy";
import { ResourceDisplay } from "@/components/ResourceDisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Gamepad, Medal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Arcade = () => {
  const { gameState } = useGame();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  
  useEffect(() => {
    document.title = "Arcade - TapVerse";
  }, []);
  
  // Placeholder for mini-games data
  const games = [
    {
      id: "coin-catcher",
      name: "Coin Catcher",
      description: "Swipe to collect falling coins before they disappear!",
      unlockLevel: 2,
      difficulty: "Easy",
      rewards: "Up to 50 coins",
      image: "🪙"
    },
    {
      id: "memory-match",
      name: "Memory Match",
      description: "Match identical symbols to earn bonus coins",
      unlockLevel: 4,
      difficulty: "Medium",
      rewards: "Up to 100 coins",
      image: "🎯"
    },
    {
      id: "spin-wheel",
      name: "Spin the Wheel",
      description: "Daily spins for random prizes and boosts",
      unlockLevel: 3,
      difficulty: "Easy",
      rewards: "Random prizes",
      image: "🎡"
    }
  ];
  
  // Check if a game is unlocked based on player level
  const isGameUnlocked = (unlockLevel: number) => {
    return gameState.level >= unlockLevel;
  };
  
  const handleSelectGame = (gameId: string) => {
    setSelectedGame(gameId === selectedGame ? null : gameId);
  };
  
  const handleStartGame = (gameId: string) => {
    // This would eventually launch the actual mini-game
    console.log(`Starting game: ${gameId}`);
    // For now just show a placeholder
    setSelectedGame(gameId);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-light-gray py-10 px-4 pb-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center gradient-text mb-2">Arcade</h1>
        <p className="text-center text-gray-600 mb-6">Play mini-games to earn extra rewards!</p>
        
        <ResourceDisplay />
        
        <div className="mt-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Games</TabsTrigger>
              <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="space-y-4">
                {games.map((game) => (
                  <div 
                    key={game.id}
                    className={`bg-white rounded-lg p-4 border 
                      ${isGameUnlocked(game.unlockLevel) ? 
                        'border-purple/20 cursor-pointer hover:bg-purple/5' : 
                        'border-gray-200 opacity-70'}`}
                    onClick={() => isGameUnlocked(game.unlockLevel) && handleSelectGame(game.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 text-xl
                          ${isGameUnlocked(game.unlockLevel) ? 
                            'bg-gradient-to-r from-purple to-teal text-white' : 
                            'bg-gray-200'}`}
                        >
                          {isGameUnlocked(game.unlockLevel) ? game.image : <Lock className="h-5 w-5 text-gray-400" />}
                        </div>
                        <div>
                          <h3 className="font-medium">{game.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={isGameUnlocked(game.unlockLevel) ? "default" : "outline"} className="text-xs">
                              {isGameUnlocked(game.unlockLevel) ? game.difficulty : `Unlocks at level ${game.unlockLevel}`}
                            </Badge>
                            {isGameUnlocked(game.unlockLevel) && (
                              <Badge variant="outline" className="text-xs bg-gold/10 text-gold border-gold/20">
                                {game.rewards}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {selectedGame === game.id && isGameUnlocked(game.unlockLevel) && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-4">{game.description}</p>
                        <div className="flex justify-center">
                          <Button 
                            onClick={() => handleStartGame(game.id)}
                            className="bg-gradient-to-r from-purple to-teal text-white"
                          >
                            <Gamepad className="mr-2 h-4 w-4" /> 
                            Start Game
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="unlocked">
              <div className="space-y-4 mt-4">
                {games
                  .filter(game => isGameUnlocked(game.unlockLevel))
                  .map((game) => (
                    <div 
                      key={game.id}
                      className="bg-white rounded-lg p-4 border border-purple/20 cursor-pointer hover:bg-purple/5"
                      onClick={() => handleSelectGame(game.id)}
                    >
                      {/* Game content - same as above, but only for unlocked games */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple to-teal flex items-center justify-center mr-3 text-xl text-white">
                            {game.image}
                          </div>
                          <div>
                            <h3 className="font-medium">{game.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="default" className="text-xs">
                                {game.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-gold/10 text-gold border-gold/20">
                                {game.rewards}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {selectedGame === game.id && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-4">{game.description}</p>
                          <div className="flex justify-center">
                            <Button 
                              onClick={() => handleStartGame(game.id)}
                              className="bg-gradient-to-r from-purple to-teal text-white"
                            >
                              <Gamepad className="mr-2 h-4 w-4" /> 
                              Start Game
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                {games.filter(game => isGameUnlocked(game.unlockLevel)).length === 0 && (
                  <div className="text-center py-8">
                    <Medal className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Keep leveling up to unlock games!</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="daily">
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gold to-amber-500 flex items-center justify-center mx-auto mb-3 text-2xl">
                  🎡
                </div>
                <h3 className="font-bold mb-1">Spin the Wheel</h3>
                <p className="text-gray-600 mb-4">Daily chance to win amazing prizes!</p>
                <Button 
                  className="bg-gradient-to-r from-gold to-amber-500 text-white"
                  onClick={() => handleStartGame('spin-wheel')}
                  disabled={!isGameUnlocked(3)}
                >
                  {isGameUnlocked(3) ? 'Spin Now!' : `Unlocks at Level 3 (Current: ${gameState.level})`}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <AiBuddy />
    </div>
  );
};

export default Arcade;
