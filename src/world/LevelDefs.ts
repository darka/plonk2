export interface SpawnDef {
  type: 'flier-swarm' | 'seeker' | 'spinner' | 'bomber' | 'dasher';
  startTick: number;
  interval: number;
  count?: number;
}

export interface LevelDef {
  title: string;
  subtitle: string;
  duration: number;
  spawns: SpawnDef[];
}

export const LEVELS: LevelDef[] = [
  // Level 1: Fliers only
  {
    title: 'Level 1',
    subtitle: 'Titular Caverns',
    duration: 3600,
    spawns: [
      { type: 'flier-swarm', startTick: 60, interval: 900, count: 20 },
    ],
  },
  // Level 2: Fliers + Seekers
  {
    title: 'Level 2',
    subtitle: 'Deep Waters',
    duration: 3600,
    spawns: [
      { type: 'flier-swarm', startTick: 60, interval: 900, count: 20 },
      { type: 'seeker', startTick: 300, interval: 600 },
    ],
  },
  // Level 3: Fliers + Seekers + Spinners
  {
    title: 'Level 3',
    subtitle: 'Spiral Depths',
    duration: 4500,
    spawns: [
      { type: 'flier-swarm', startTick: 60, interval: 900, count: 20 },
      { type: 'seeker', startTick: 200, interval: 500 },
      { type: 'spinner', startTick: 300, interval: 450 },
    ],
  },
  // Level 4: All previous + Bombers
  {
    title: 'Level 4',
    subtitle: 'Minefield',
    duration: 4500,
    spawns: [
      { type: 'flier-swarm', startTick: 60, interval: 800, count: 20 },
      { type: 'seeker', startTick: 200, interval: 500 },
      { type: 'spinner', startTick: 300, interval: 450 },
      { type: 'bomber', startTick: 400, interval: 600 },
    ],
  },
  // Level 5: All enemies, faster spawns
  {
    title: 'Level 5',
    subtitle: 'The Abyss',
    duration: 5400,
    spawns: [
      { type: 'flier-swarm', startTick: 60, interval: 600, count: 20 },
      { type: 'seeker', startTick: 120, interval: 400 },
      { type: 'spinner', startTick: 180, interval: 350 },
      { type: 'bomber', startTick: 240, interval: 500 },
      { type: 'dasher', startTick: 300, interval: 450 },
    ],
  },
];
