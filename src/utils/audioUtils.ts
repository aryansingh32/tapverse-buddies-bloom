
// Create audio elements for different sounds
let tapSound: HTMLAudioElement | null = null;
let perfectSound: HTMLAudioElement | null = null;
let backgroundMusic: HTMLAudioElement | null = null;

// Initialize sounds if in browser environment
if (typeof window !== "undefined") {
  tapSound = new Audio("/sounds/tap.mp3");
  perfectSound = new Audio("/sounds/perfect.mp3");
  backgroundMusic = new Audio("/sounds/background-beat.mp3");
  backgroundMusic.loop = true;
}

export const sounds = {
  tapSound,
  perfectSound,
  backgroundMusic
};

// Play sound utility
export const playSound = (sound: HTMLAudioElement | null) => {
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
};

// Pause sound utility
export const pauseSound = (sound: HTMLAudioElement | null) => {
  if (sound) {
    sound.pause();
    sound.currentTime = 0;
  }
};
