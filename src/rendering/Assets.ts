// Asset preloader -- loads SVG images and MP3 sounds before game starts.

interface SpriteAsset {
  img: HTMLImageElement;
  // The Flash registration point offset within the SVG
  originX: number;
  originY: number;
  width: number;
  height: number;
}

const sprites: Record<string, SpriteAsset> = {};
const sounds: Record<string, HTMLAudioElement> = {};

function loadImage(name: string, url: string, originX: number, originY: number, w: number, h: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      sprites[name] = { img, originX, originY, width: w, height: h };
      resolve();
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

function loadSound(name: string, url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.oncanplaythrough = () => {
      sounds[name] = audio;
      resolve();
    };
    audio.onerror = () => reject(new Error(`Failed to load sound: ${url}`));
    audio.src = url;
  });
}

export async function loadAssets(): Promise<void> {
  await Promise.all([
    // Sprites: name, url, originX, originY, width, height
    loadImage('player',     'shapes/player.svg',       10.25, 16.4,  20.6,  25.55),
    loadImage('gun',        'shapes/gun.svg',           2.25,  5.75,  4.45,   6.8),
    loadImage('bullet',     'shapes/bullet.svg',        3.1,   3.05,  6.2,    6.2),
    loadImage('flier',      'shapes/flier.svg',        10.7,  16.2,  21.35,  32.45),
    loadImage('bubble',     'shapes/bubble.svg',        4.5,   4.95,  9.8,    9.8),
    loadImage('seeker',     'shapes/seeker.svg',       14.7,  14.9,  29.75,  29.7),
    loadImage('background', 'shapes/background.svg',  -40.0,  27.2, 853.75, 544.0),
    loadImage('interfaceBg','shapes/interface-bg.svg', -23.05,-408.1,594.75,  49.0),
    loadImage('orbPad',     'shapes/orb-pad.svg',       2.1,  -4.0, 956.3,  552.2),
    loadImage('orb',        'shapes/orb.svg',           0.0,   0.0, 445.05, 445.05),
    // Sounds
    loadSound('phaser',    'sounds/1_PhaserSound.mp3'),
    loadSound('explosion', 'sounds/2_ExplosionSound.mp3'),
  ]);
}

export function getSprite(name: string): SpriteAsset {
  return sprites[name];
}

export function getSound(name: string): HTMLAudioElement {
  return sounds[name];
}
