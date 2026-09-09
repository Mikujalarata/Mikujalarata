import type { WorldContentEntry } from '../types';

export const worldContent: WorldContentEntry[] = [
  {
    id: 'technology-lab',
    title: 'Technology Lab',
    description: 'A gateway representing software, experimentation and technical building.',
    type: 'technology',
    destination: 'digital-city',
  },
  {
    id: 'projects-archive',
    title: 'Projects Archive',
    description: 'A discoverable archive for projects that can be expanded as the world grows.',
    type: 'project',
    destination: 'projects',
  },
  {
    id: 'memory-gallery',
    title: 'Memory Gallery',
    description: 'A safe container for future memories supplied explicitly by the player.',
    type: 'memory',
    destination: 'memory',
  },
];
