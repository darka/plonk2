import { getSound } from '../rendering/Assets';

export function playPhaser(): void {
  const clone = getSound('phaser').cloneNode() as HTMLAudioElement;
  clone.play();
}

export function playExplosion(): void {
  const clone = getSound('explosion').cloneNode() as HTMLAudioElement;
  clone.play();
}
