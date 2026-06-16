export default function playSoundOnHover() {
  const sound = typeof window !== undefined ? new Audio("/remove.mp3") : null;
  if (sound) {
    sound.preload = "auto";
    sound.currentTime = 0;
    sound.volume = 0.2;
    sound.play();
  }
}
