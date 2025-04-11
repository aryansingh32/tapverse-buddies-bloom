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
  aiName: string;
  powerBoostActive: boolean;
  powerBoostEndTime: number;
  doubleCoinsActive: boolean;
  doubleCoinsEndTime: number;
  autoTapActive: boolean;
  autoTapEndTime: number;
  dailyAdsWatched: number;
  weeklyAdsWatched: number;
  totalAdsWatched: number;
  tempUnlockedArcadeGames: { gameId: string; unlockEndTime: number }[];
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
  applyBoost: (type: 'power' | 'double' | 'auto', duration: number) => void;
  watchAd: (reason: 'energy' | 'quest' | 'boost' | 'arcade') => Promise<boolean>;
  unlockGameWithAd: (gameId: string, hours: number) => void;
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
  aiName: '',
  powerBoostActive: false,
  powerBoostEndTime: 0,
  doubleCoinsActive: false,
  doubleCoinsEndTime: 0,
  autoTapActive: false,
  autoTapEndTime: 0,
  dailyAdsWatched: 0,
  weeklyAdsWatched: 0,
  totalAdsWatched: 0,
  tempUnlockedArcadeGames: [],
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

  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      aiName
    }));
  }, [aiName]);

  useEffect(() => {
    localStorage.setItem('tapverse-game-state', JSON.stringify(gameState));
    localStorage.setItem('tapverse-upgrades', JSON.stringify(upgrades));
    localStorage.setItem('tapverse-quests', JSON.stringify(quests));
    localStorage.setItem('tapverse-chapters', JSON.stringify(chapters));
    localStorage.setItem('tapverse-ai-name', aiName);
  }, [gameState, upgrades, quests, chapters, aiName]);

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    if (gameState.lastPlayDate !== currentDate) {
      setGameState(prev => ({
        ...prev,
        dailyTaps: 0,
        dailyAdsWatched: 0,
        lastPlayDate: currentDate,
        streakDays: isConsecutiveDay(prev.lastPlayDate, currentDate) 
          ? prev.streakDays + 1 
          : 1
      }));
      
      setQuests(prev => prev.map(quest => {
        if (quest.type === 'daily') {
          return { ...quest, progress: 0, completed: false };
        }
        return quest;
      }));
      
      setCurrentBuddyMessage({
        type: 'greeting',
        message: `Welcome back! You're on a ${gameState.streakDays + 1} day streak!`
      });
    }
    
    const today = new Date();
    if (today.getDay() === 0) {
      const lastLoginWeek = new Date(gameState.lastPlayDate).getDay();
      
      if (lastLoginWeek !== 0) {
        setGameState(prev => ({
          ...prev,
          weeklyAdsWatched: 0
        }));
        
        setQuests(prev => prev.map(quest => {
          if (quest.type === 'weekly') {
            return { ...quest, progress: 0, completed: false };
          }
          return quest;
        }));
      }
    }
  }, []);

  const isConsecutiveDay = (lastDate: string, currentDate: string) => {
    const last = new Date(lastDate);
    const current = new Date(currentDate);
    const diffTime = Math.abs(current.getTime() - last.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  };

  useEffect(() => {
    const energyTimer = setInterval(() => {
      setGameState((prev) => {
        if (prev.energy < prev.maxEnergy) {
          return { ...prev, energy: Math.min(prev.energy + 1, prev.maxEnergy) };
        }
        return prev;
      });
    }, 5000);

    return () => clearInterval(energyTimer);
  }, []);

  const handleTap = () => {
    if (gameState.energy <= 0) return;

    const powerMultiplier = gameState.powerBoostActive ? 2 : 1;
    const doubleMultiplier = gameState.doubleCoinsActive ? 2 : 1;
    const coinsEarned = gameState.tapPower * gameState.coinMultiplier * powerMultiplier * doubleMultiplier;
    
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + coinsEarned,
      energy: Math.max(0, prev.energy - 1),
      totalTaps: prev.totalTaps + 1,
      dailyTaps: prev.dailyTaps + 1,
      experience: prev.experience + 1
    }));

    setQuests(prevQuests => prevQuests.map(quest => {
      if (quest.completed) return quest;
      
      let newProgress = quest.progress;
      
      if (quest.id === 'daily-1' || quest.id === 'weekly-1') {
        newProgress = quest.progress + 1;
      } else if (quest.id === 'daily-2') {
        newProgress = quest.progress + coinsEarned;
      }
      
      return {
        ...quest,
        progress: newProgress,
        completed: newProgress >= quest.requirement
      };
    }));
    
    checkForLevelUp();
    
    if (Math.random() < 0.1) {
      showNewMessage();
    }
  };

  const checkForLevelUp = () => {
    const newLevel = 1 + Math.floor(gameState.experience / 100);
    
    if (newLevel > gameState.level) {
      setGameState(prev => ({ 
        ...prev, 
        level: newLevel,
        unlockedChapters: [
          ...prev.unlockedChapters,
          ...chapters
            .filter(chapter => chapter.unlockLevel <= newLevel && !prev.unlockedChapters.includes(chapter.id))
            .map(chapter => chapter.id)
        ]
      }));
      
      setCurrentBuddyMessage({
        type: 'achievement',
        message: `Congratulations! You've reached level ${newLevel}!`
      });
    }
  };

  const buyUpgrade = (id: string) => {
    const upgrade = upgrades.find(u => u.id === id);
    if (!upgrade) return;
    
    if (gameState.coins >= upgrade.cost) {
      setGameState((prev) => {
        const newState = { ...prev, coins: prev.coins - upgrade.cost };
        
        switch (upgrade.effect) {
          case 'tapPower':
            newState.tapPower += upgrade.value;
            break;
          case 'coinMultiplier':
            newState.coinMultiplier += upgrade.value;
            break;
          case 'maxEnergy':
            newState.maxEnergy += upgrade.value;
            newState.energy += upgrade.value;
            break;
          default:
            break;
        }
        
        return newState;
      });
      
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
      
      setCurrentBuddyMessage({
        type: 'achievement',
        message: `Great job upgrading your ${upgrade.name}!`
      });
    }
  };

  const showNewMessage = () => {
    const randomIndex = Math.floor(Math.random() * buddyMessages.length);
    setCurrentBuddyMessage(buddyMessages[randomIndex]);
    
    setTimeout(() => {
      setCurrentBuddyMessage(null);
    }, 4000);
  };

  const resetEnergy = () => {
    setGameState((prev) => ({ ...prev, energy: prev.maxEnergy }));
  };

  const changeSkin = (skin: string) => {
    if (gameState.unlockedSkins.includes(skin)) {
      setGameState((prev) => ({ ...prev, selectedSkin: skin }));
    }
  };
  
  const completeQuest = (id: string) => {
    setQuests(prev => prev.map(quest => 
      quest.id === id ? { ...quest, completed: true } : quest
    ));
  };
  
  const claimQuestReward = (id: string) => {
    const quest = quests.find(q => q.id === id);
    if (!quest || !quest.completed) return;
    
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + quest.rewardCoins,
      experience: prev.experience + quest.rewardXp
    }));
    
    checkForLevelUp();
    
    setQuests(prev => prev.map(q => 
      q.id === id ? { ...q, progress: q.requirement + 1 } : q
    ));
    
    setCurrentBuddyMessage({
      type: 'achievement',
      message: `Quest reward claimed: ${quest.rewardCoins} coins & ${quest.rewardXp} XP!`
    });
  };
  
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

  const watchAd = async (reason: 'energy' | 'quest' | 'boost' | 'arcade'): Promise<boolean> => {
    setGameState(prev => ({
      ...prev,
      dailyAdsWatched: prev.dailyAdsWatched + 1,
      weeklyAdsWatched: prev.weeklyAdsWatched + 1,
      totalAdsWatched: prev.totalAdsWatched + 1
    }));
    
    setQuests(prevQuests => prevQuests.map(quest => {
      if ((quest.id === 'daily-ads' || quest.id === 'weekly-ads') && !quest.completed) {
        const newProgress = quest.progress + 1;
        return {
          ...quest,
          progress: newProgress,
          completed: newProgress >= quest.requirement
        };
      }
      return quest;
    }));
    
    return true;
  };

  const unlockGameWithAd = (gameId: string, hours: number) => {
    const endTime = Date.now() + (hours * 60 * 60 * 1000);
    
    setGameState(prev => ({
      ...prev,
      tempUnlockedArcadeGames: [
        ...prev.tempUnlockedArcadeGames.filter(g => g.gameId !== gameId),
        { gameId, unlockEndTime: endTime }
      ]
    }));
    
    setCurrentBuddyMessage({
      type: 'achievement',
      message: `${gameId} unlocked for ${hours} hours! Enjoy!`
    });
  };

  useEffect(() => {
    const now = Date.now();
    
    if (gameState.powerBoostActive && now > gameState.powerBoostEndTime) {
      setGameState(prev => ({ ...prev, powerBoostActive: false }));
    }
    if (gameState.doubleCoinsActive && now > gameState.doubleCoinsEndTime) {
      setGameState(prev => ({ ...prev, doubleCoinsActive: false }));
    }
    if (gameState.autoTapActive && now > gameState.autoTapEndTime) {
      setGameState(prev => ({ ...prev, autoTapActive: false }));
    }
    
    let autoTapInterval: NodeJS.Timeout | null = null;
    
    if (gameState.autoTapActive) {
      autoTapInterval = setInterval(() => {
        if (gameState.energy > 0) {
          handleTap();
        }
      }, 1000);
    }
    
    return () => {
      if (autoTapInterval) {
        clearInterval(autoTapInterval);
      }
    };
  }, [gameState.powerBoostActive, gameState.doubleCoinsActive, gameState.autoTapActive, 
      gameState.powerBoostEndTime, gameState.doubleCoinsEndTime, gameState.autoTapEndTime, 
      gameState.energy]);

  const applyBoost = (type: 'power' | 'double' | 'auto', duration: number) => {
    const now = Date.now();
    const endTime = now + (duration * 1000);
    
    switch (type) {
      case 'power':
        setGameState(prev => ({ 
          ...prev, 
          powerBoostActive: true, 
          powerBoostEndTime: endTime 
        }));
        break;
      case 'double':
        setGameState(prev => ({ 
          ...prev, 
          doubleCoinsActive: true, 
          doubleCoinsEndTime: endTime 
        }));
        break;
      case 'auto':
        setGameState(prev => ({ 
          ...prev, 
          autoTapActive: true, 
          autoTapEndTime: endTime 
        }));
        break;
    }
  };

  useEffect(() => {
    const now = Date.now();
    
    if (gameState.tempUnlockedArcadeGames && gameState.tempUnlockedArcadeGames.some(game => game.unlockEndTime < now)) {
      setGameState(prev => ({
        ...prev,
        tempUnlockedArcadeGames: prev.tempUnlockedArcadeGames.filter(
          game => game.unlockEndTime > now
        )
      }));
    }
    
    const timer = setInterval(() => {
      const now = Date.now();
      setGameState(prev => {
        if (prev.tempUnlockedArcadeGames && prev.tempUnlockedArcadeGames.some(game => game.unlockEndTime < now)) {
          return {
            ...prev,
            tempUnlockedArcadeGames: prev.tempUnlockedArcadeGames.filter(
              game => game.unlockEndTime > now
            )
          };
        }
        return prev;
      });
    }, 60000);
    
    return () => clearInterval(timer);
  }, [gameState.tempUnlockedArcadeGames]);

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
        claimQuestReward,
        applyBoost,
        watchAd,
        unlockGameWithAd
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
