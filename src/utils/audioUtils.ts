
// Create audio elements for different sounds
let tapSound: HTMLAudioElement | null = null;
let perfectSound: HTMLAudioElement | null = null;
let backgroundMusic: HTMLAudioElement | null = null;

// Initialize sounds if in browser environment
const initializeAudio = () => {
  if (typeof window !== "undefined") {
    try {
      tapSound = new Audio("/sounds/tap.mp3");
      perfectSound = new Audio("/sounds/perfect.mp3");
      backgroundMusic = new Audio("/sounds/background-beat.mp3");
      backgroundMusic.loop = true;
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
      sound.currentTime = 0;
      sound.play().catch(err => {
        console.warn("Could not play sound:", err);
      });
    } catch (error) {
      console.warn("Error playing sound:", error);
    }
  }
};

// Pause sound utility with safety checks
export const pauseSound = (sound: HTMLAudioElement | null) => {
  if (sound) {
    try {
      sound.pause();
      sound.currentTime = 0;
    } catch (error) {
      console.warn("Error pausing sound:", error);
    }
  }
};
