let hoverSound: HTMLAudioElement | null = null;

function getHoverSound() {
  if (typeof window === "undefined" || typeof Audio === "undefined") {
    return null;
  }

  if (!hoverSound) {
    hoverSound = new Audio("/remove.mp3");
    hoverSound.preload = "auto";
    hoverSound.volume = 0.5;
  }

  return hoverSound;
}

export default function playSoundOnHover() {
  const sound = getHoverSound();

  if (!sound) {
    return;
  }

  sound.currentTime = 0;
  sound.play().catch((error) => {
    console.log("ungabunga", error);
  });
}
