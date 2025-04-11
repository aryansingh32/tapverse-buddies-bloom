
// Create audio elements for different sounds
let tapSound: HTMLAudioElement | null = null;
let perfectSound: HTMLAudioElement | null = null;
let backgroundMusic: HTMLAudioElement | null = null;

// Initialize sounds if in browser environment
const initializeAudio = () => {
  if (typeof window !== "undefined") {
    try {
      // Use a more robust approach to create audio elements
      tapSound = new Audio();
      tapSound.src = "/sounds/tap.mp3";
      tapSound.preload = "auto";
      
      perfectSound = new Audio();
      perfectSound.src = "/sounds/perfect.mp3";
      perfectSound.preload = "auto";
      
      backgroundMusic = new Audio();
      backgroundMusic.src = "/sounds/background-beat.mp3";
      backgroundMusic.loop = true;
      backgroundMusic.preload = "auto";
      
      // Preload sounds
      document.addEventListener('click', () => {
        // Many browsers require user interaction before playing audio
        tapSound?.load();
        perfectSound?.load();
        backgroundMusic?.load();
      }, { once: true });
      
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  }
};

// Call initialization
initializeAudio();

export const sounds = {
  tapSound,
  perfectSound,
  backgroundMusic
};

// Play sound utility with safety checks
export const playSound = (sound: HTMLAudioElement | null) => {
  if (sound) {
    try {
      // Reset the audio to the beginning
      sound.currentTime = 0;
      
      // Create a promise to catch potential play() promise rejection
      const playPromise = sound.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn("Could not play sound:", err);
        });
      }
    } catch (error) {
      console.warn("Error playing sound:", error);
    }
  }
};

// Pause sound utility with safety checks
export const pauseSound = (sound: HTMLAudioElement | null) => {
  if (sound) {
    try {
      // Check if the audio is actually playing before pausing
      if (!sound.paused) {
        sound.pause();
      }
      sound.currentTime = 0;
    } catch (error) {
      console.warn("Error pausing sound:", error);
    }
  }
};

// Toggle background music
export const toggleBackgroundMusic = (enabled: boolean) => {
  if (!backgroundMusic) return;
  
  try {
    if (enabled) {
      backgroundMusic.volume = 0.3; // Lower volume for background music
      const playPromise = backgroundMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn("Could not play background music:", err);
        });
      }
    } else {
      if (!backgroundMusic.paused) {
        backgroundMusic.pause();
      }
      backgroundMusic.currentTime = 0;
    }
  } catch (error) {
    console.warn("Error toggling background music:", error);
  }
};
