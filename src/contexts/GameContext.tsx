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
  experience: number;
  level: number;
  totalTaps: number;
  dailyTaps: number;
  streakDays: number;
  lastPlayDate: string;
  badgesCollected: string[];
  dropEventsJoined: number;
  dropEventsRedeemed: number;
  unlockedChapters: number[];
  currentChapter: number;
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

// Define Quest interface
interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  requirement: number;
  progress: number;
  completed: boolean;
  rewardCoins: number;
  rewardXp: number;
}

// Define Story Chapter interface
interface StoryChapter {
  id: number;
  title: string;
  planet: string;
  description: string;
  unlockLevel: number;
  completed: boolean;
  dialogues: StoryDialogue[];
}

// Define Story Dialogue interface
interface StoryDialogue {
  id: number;
  speaker: 'player' | 'buddy' | 'narrator';
  text: string;
  read: boolean;
}

interface GameContextProps {
  gameState: GameState;
  upgrades: Upgrade[];
  quests: Quest[];
  chapters: StoryChapter[];
  handleTap: () => void;
  buyUpgrade: (id: string) => void;
  buddyMessages: BuddyMessage[];
  currentBuddyMessage: BuddyMessage | null;
  aiName: string;
  showNewMessage: () => void;
  resetEnergy: () => void;
  changeSkin: (skin: string) => void;
  completeQuest: (id: string) => void;
  readDialogue: (chapterId: number, dialogueId: number) => void;
  claimQuestReward: (id: string) => void;
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
  experience: 0,
  level: 1,
  totalTaps: 0,
  dailyTaps: 0,
  streakDays: 0,
  lastPlayDate: new Date().toISOString().split('T')[0],
  badgesCollected: [],
  dropEventsJoined: 0,
  dropEventsRedeemed: 0,
  unlockedChapters: [1],
  currentChapter: 1,
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

// Initial Quests
const initialQuests: Quest[] = [
  {
    id: 'daily-1',
    title: 'Tap 1,000 Times Today',
    description: 'Tap your way to success 1,000 times today!',
    type: 'daily',
    requirement: 1000,
    progress: 0,
    completed: false,
    rewardCoins: 100,
    rewardXp: 50
  },
  {
    id: 'daily-2',
    title: 'Earn 500 Coins',
    description: 'Collect 500 coins in a single day',
    type: 'daily',
    requirement: 500,
    progress: 0,
    completed: false,
    rewardCoins: 50,
    rewardXp: 25
  },
  {
    id: 'weekly-1',
    title: 'Tap 10,000 Times',
    description: 'Reach 10,000 taps this week',
    type: 'weekly',
    requirement: 10000,
    progress: 0,
    completed: false,
    rewardCoins: 500,
    rewardXp: 200
  },
  {
    id: 'weekly-2',
    title: 'Buy 3 Upgrades',
    description: 'Purchase 3 upgrades from the shop',
    type: 'weekly',
    requirement: 3,
    progress: 0,
    completed: false,
    rewardCoins: 300,
    rewardXp: 150
  }
];

// Initial Story Chapters
const initialChapters: StoryChapter[] = [
  {
    id: 1,
    title: 'The Beginning',
    planet: 'Earth',
    description: 'Your journey with your AI buddy begins on Earth as you discover mysterious cosmic coins.',
    unlockLevel: 1,
    completed: false,
    dialogues: [
      {
        id: 1,
        speaker: 'narrator',
        text: 'In a world where digital currencies became the norm, mysterious cosmic coins appeared...',
        read: false
      },
      {
        id: 2,
        speaker: 'buddy',
        text: "Hi there! I'm your AI buddy. I've detected unusual energy signatures nearby. Want to check it out?",
        read: false
      },
      {
        id: 3,
        speaker: 'player',
        text: "Let's go investigate! What are these glowing coins?",
        read: false
      },
      {
        id: 4,
        speaker: 'buddy',
        text: "They seem to be some kind of cosmic currency. Try tapping on them to collect them!",
        read: false
      }
    ]
  },
  {
    id: 2,
    title: 'The Moon Base',
    planet: 'Moon',
    description: 'Your journey takes you to a secret base on the Moon where cosmic coins are being mined.',
    unlockLevel: 5,
    completed: false,
    dialogues: [
      {
        id: 1,
        speaker: 'narrator',
        text: 'After collecting enough cosmic coins, you and your buddy build a rocket to the Moon...',
        read: false
      },
      {
        id: 2,
        speaker: 'buddy',
        text: "Look at all those coins in the lunar craters! The Moon seems to be a hotspot for cosmic currency.",
        read: false
      },
      {
        id: 3,
        speaker: 'player',
        text: "Let's set up a mining station here and collect as many as we can!",
        read: false
      }
    ]
  },
  {
    id: 3,
    title: 'The Mars Mystery',
    planet: 'Mars',
    description: 'Strange events on Mars lead to the discovery of a new type of cosmic coin.',
    unlockLevel: 10,
    completed: false,
    dialogues: [
      {
        id: 1,
        speaker: 'narrator',
        text: 'Reports of strange lights on Mars piqued your curiosity...',
        read: false
      },
      {
        id: 2,
        speaker: 'buddy',
        text: "These Martian coins seem more powerful than the ones we found on the Moon. They glow with a different energy!",
        read: false
      }
    ]
  }
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
  
  const [quests, setQuests] = useState<Quest[]>(() => {
    const savedQuests = localStorage.getItem('tapverse-quests');
    return savedQuests ? JSON.parse(savedQuests) : initialQuests;
  });
  
  const [chapters, setChapters] = useState<StoryChapter[]>(() => {
    const savedChapters = localStorage.getItem('tapverse-chapters');
    return savedChapters ? JSON.parse(savedChapters) : initialChapters;
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
    localStorage.setItem('tapverse-quests', JSON.stringify(quests));
    localStorage.setItem('tapverse-chapters', JSON.stringify(chapters));
    localStorage.setItem('tapverse-ai-name', aiName);
  }, [gameState, upgrades, quests, chapters, aiName]);

  // Check for day change to reset daily quests and update streak
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    if (gameState.lastPlayDate !== currentDate) {
      // It's a new day
      setGameState(prev => ({
        ...prev,
        dailyTaps: 0,
        lastPlayDate: currentDate,
        streakDays: isConsecutiveDay(prev.lastPlayDate, currentDate) 
          ? prev.streakDays + 1 
          : 1
      }));
      
      // Reset daily quests
      setQuests(prev => prev.map(quest => {
        if (quest.type === 'daily') {
          return { ...quest, progress: 0, completed: false };
        }
        return quest;
      }));
      
      // Show welcome back message
      setCurrentBuddyMessage({
        type: 'greeting',
        message: `Welcome back! You're on a ${gameState.streakDays + 1} day streak!`
      });
    }
  }, []);
  
  // Helper function to check if dates are consecutive
  const isConsecutiveDay = (lastDate: string, currentDate: string) => {
    const last = new Date(lastDate);
    const current = new Date(currentDate);
    const diffTime = Math.abs(current.getTime() - last.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  };

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
      totalTaps: prev.totalTaps + 1,
      dailyTaps: prev.dailyTaps + 1,
      experience: prev.experience + 1
    }));

    // Update quests progress
    setQuests(prevQuests => prevQuests.map(quest => {
      if (quest.completed) return quest;
      
      let newProgress = quest.progress;
      
      if (quest.id === 'daily-1' || quest.id === 'weekly-1') {
        // Tap quest
        newProgress = quest.progress + 1;
      } else if (quest.id === 'daily-2') {
        // Earn coins quest
        newProgress = quest.progress + coinsEarned;
      }
      
      return {
        ...quest,
        progress: newProgress,
        completed: newProgress >= quest.requirement
      };
    }));
    
    // Check for level up
    checkForLevelUp();

    // Random chance to show a message
    if (Math.random() < 0.1) {
      showNewMessage();
    }
  };
  
  // Check for level up
  const checkForLevelUp = () => {
    // Simple level formula: level = 1 + Math.floor(exp / 100)
    const newLevel = 1 + Math.floor(gameState.experience / 100);
    
    if (newLevel > gameState.level) {
      // Level up!
      setGameState(prev => ({ 
        ...prev, 
        level: newLevel,
        // Unlock chapters based on level
        unlockedChapters: [
          ...prev.unlockedChapters,
          ...chapters
            .filter(chapter => chapter.unlockLevel <= newLevel && !prev.unlockedChapters.includes(chapter.id))
            .map(chapter => chapter.id)
        ]
      }));
      
      // Show level up message
      setCurrentBuddyMessage({
        type: 'achievement',
        message: `Congratulations! You've reached level ${newLevel}!`
      });
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
      
      // Update buy upgrades quest
      setQuests(prevQuests => prevQuests.map(quest => {
        if (quest.id === 'weekly-2' && !quest.completed) {
          const newProgress = quest.progress + 1;
          return {
            ...quest,
            progress: newProgress,
            completed: newProgress >= quest.requirement
          };
        }
        return quest;
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
  
  // Complete a quest
  const completeQuest = (id: string) => {
    setQuests(prev => prev.map(quest => 
      quest.id === id ? { ...quest, completed: true } : quest
    ));
  };
  
  // Claim quest reward
  const claimQuestReward = (id: string) => {
    const quest = quests.find(q => q.id === id);
    if (!quest || !quest.completed) return;
    
    // Add rewards
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + quest.rewardCoins,
      experience: prev.experience + quest.rewardXp
    }));
    
    // Check for level up after XP gain
    checkForLevelUp();
    
    // Mark as claimed by setting progress beyond requirement
    setQuests(prev => prev.map(q => 
      q.id === id ? { ...q, progress: q.requirement + 1 } : q
    ));
    
    // Show message
    setCurrentBuddyMessage({
      type: 'achievement',
      message: `Quest reward claimed: ${quest.rewardCoins} coins & ${quest.rewardXp} XP!`
    });
  };
  
  // Read dialogue in a story chapter
  const readDialogue = (chapterId: number, dialogueId: number) => {
    setChapters(prev => prev.map(chapter => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          dialogues: chapter.dialogues.map(dialogue => {
            if (dialogue.id === dialogueId) {
              return { ...dialogue, read: true };
            }
            return dialogue;
          })
        };
      }
      return chapter;
    }));
  };

  return (
    <GameContext.Provider 
      value={{ 
        gameState, 
        upgrades, 
        quests,
        chapters,
        handleTap,
        buyUpgrade,
        buddyMessages,
        currentBuddyMessage,
        aiName,
        showNewMessage,
        resetEnergy,
        changeSkin,
        completeQuest,
        readDialogue,
        claimQuestReward
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
