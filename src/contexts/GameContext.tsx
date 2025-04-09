
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the types for our game state
interface GameState {
  coins: number;
  tapPower: number;
  coinMultiplier: number;
  energy: number;
  maxEnergy: number;
  aiLevel: number;
  unlockedSkins: string[];
  selectedSkin: string;
}

// Define upgrades available in the shop
interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: string;
  value: number;
  owned: number;
}

// Define AI buddy messages
interface BuddyMessage {
  type: 'greeting' | 'achievement' | 'tip' | 'encouragement' | 'random';
  message: string;
}

interface GameContextProps {
  gameState: GameState;
  upgrades: Upgrade[];
  handleTap: () => void;
  buyUpgrade: (id: string) => void;
  buddyMessages: BuddyMessage[];
  currentBuddyMessage: BuddyMessage | null;
  aiName: string;
  showNewMessage: () => void;
  resetEnergy: () => void;
  changeSkin: (skin: string) => void;
}

const initialGameState: GameState = {
  coins: 0,
  tapPower: 1,
  coinMultiplier: 1,
  energy: 100,
  maxEnergy: 100,
  aiLevel: 1,
  unlockedSkins: ['default'],
  selectedSkin: 'default',
};

const initialUpgrades: Upgrade[] = [
  {
    id: 'tap-power',
    name: 'Tap Power',
    description: 'Increase the number of coins per tap',
    cost: 10,
    effect: 'tapPower',
    value: 1,
    owned: 0,
  },
  {
    id: 'coin-multiplier',
    name: 'Coin Multiplier',
    description: 'Multiply the coins you earn per tap',
    cost: 50,
    effect: 'coinMultiplier',
    value: 0.1,
    owned: 0,
  },
  {
    id: 'max-energy',
    name: 'Energy Tank',
    description: 'Increase your maximum energy',
    cost: 100,
    effect: 'maxEnergy',
    value: 10,
    owned: 0,
  },
];

const initialBuddyMessages: BuddyMessage[] = [
  { type: 'greeting', message: "Hi there! I'm your AI buddy. Let's tap together!" },
  { type: 'greeting', message: "Welcome back to TapVerse! Ready to collect some coins?" },
  { type: 'achievement', message: "Great job! You're getting so many coins!" },
  { type: 'achievement', message: "Wow! You're tapping like a pro!" },
  { type: 'tip', message: "Psst! Try upgrading your tap power for more coins." },
  { type: 'tip', message: "Remember to take breaks! Your energy recharges over time." },
  { type: 'encouragement', message: "You're doing great! Keep tapping!" },
  { type: 'encouragement', message: "I believe in you! Let's earn more coins!" },
  { type: 'random', message: "Did you know? In some universes, coins tap you!" },
  { type: 'random', message: "I wonder what we could buy with all these digital coins..." },
];

const aiNames = [
  "Coin", "Tappy", "Bitsy", "Zap", "Echo", "Pixel", "Blip", "Nova", "Byte", "Sparkle"
];

const GameContext = createContext<GameContextProps | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  // Initialize state with saved values or defaults
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedState = localStorage.getItem('tapverse-game-state');
    return savedState ? JSON.parse(savedState) : initialGameState;
  });
  
  const [upgrades, setUpgrades] = useState<Upgrade[]>(() => {
    const savedUpgrades = localStorage.getItem('tapverse-upgrades');
    return savedUpgrades ? JSON.parse(savedUpgrades) : initialUpgrades;
  });
  
  const [buddyMessages, setBuddyMessages] = useState<BuddyMessage[]>(initialBuddyMessages);
  const [currentBuddyMessage, setCurrentBuddyMessage] = useState<BuddyMessage | null>(null);
  const [aiName] = useState(() => {
    const savedName = localStorage.getItem('tapverse-ai-name');
    return savedName || aiNames[Math.floor(Math.random() * aiNames.length)];
  });

  // Save game state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('tapverse-game-state', JSON.stringify(gameState));
    localStorage.setItem('tapverse-upgrades', JSON.stringify(upgrades));
    localStorage.setItem('tapverse-ai-name', aiName);
  }, [gameState, upgrades, aiName]);

  // Energy regeneration logic
  useEffect(() => {
    const energyTimer = setInterval(() => {
      setGameState((prev) => {
        if (prev.energy < prev.maxEnergy) {
          return { ...prev, energy: Math.min(prev.energy + 1, prev.maxEnergy) };
        }
        return prev;
      });
    }, 5000); // Regenerate 1 energy every 5 seconds

    return () => clearInterval(energyTimer);
  }, []);

  // Handle tap action
  const handleTap = () => {
    if (gameState.energy <= 0) return;

    const coinsEarned = gameState.tapPower * gameState.coinMultiplier;
    
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + coinsEarned,
      energy: Math.max(0, prev.energy - 1),
    }));

    // Random chance to show a message
    if (Math.random() < 0.1) {
      showNewMessage();
    }
  };

  // Buy upgrade
  const buyUpgrade = (id: string) => {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade) return;
    
    if (gameState.coins >= upgrade.cost) {
      // Update coins
      setGameState((prev) => {
        const newState = { ...prev, coins: prev.coins - upgrade.cost };
        
        // Apply upgrade effect
        switch (upgrade.effect) {
          case 'tapPower':
            newState.tapPower += upgrade.value;
            break;
          case 'coinMultiplier':
            newState.coinMultiplier += upgrade.value;
            break;
          case 'maxEnergy':
            newState.maxEnergy += upgrade.value;
            newState.energy += upgrade.value; // Also increase current energy
            break;
          default:
            break;
        }
        
        return newState;
      });
      
      // Update upgrade (increase cost for next purchase)
      setUpgrades(prev => prev.map(u => {
        if (u.id === id) {
          return {
            ...u,
            cost: Math.floor(u.cost * 1.5),
            owned: u.owned + 1,
          };
        }
        return u;
      }));
      
      // Show a message
      setCurrentBuddyMessage({
        type: 'achievement',
        message: `Great job upgrading your ${upgrade.name}!`
      });
    }
  };

  // Show new buddy message
  const showNewMessage = () => {
    const randomIndex = Math.floor(Math.random() * buddyMessages.length);
    setCurrentBuddyMessage(buddyMessages[randomIndex]);
    
    // Clear message after a few seconds
    setTimeout(() => {
      setCurrentBuddyMessage(null);
    }, 4000);
  };

  // Reset energy (for testing or special actions)
  const resetEnergy = () => {
    setGameState((prev) => ({ ...prev, energy: prev.maxEnergy }));
  };

  // Change skin
  const changeSkin = (skin: string) => {
    if (gameState.unlockedSkins.includes(skin)) {
      setGameState((prev) => ({ ...prev, selectedSkin: skin }));
    }
  };

  return (
    <GameContext.Provider 
      value={{ 
        gameState, 
        upgrades, 
        handleTap,
        buyUpgrade,
        buddyMessages,
        currentBuddyMessage,
        aiName,
        showNewMessage,
        resetEnergy,
        changeSkin
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
