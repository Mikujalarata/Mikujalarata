import { create } from 'zustand';
import type { DistrictId } from '../types';

interface WorldState {
  discoveredIds: string[];
  activeDistrict: DistrictId;
  discover: (id: string) => void;
  enterDistrict: (id: DistrictId) => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  discoveredIds: [],
  activeDistrict: 'hub',
  discover: (id) => set((state) => ({
    discoveredIds: state.discoveredIds.includes(id)
      ? state.discoveredIds
      : [...state.discoveredIds, id],
  })),
  enterDistrict: (id) => set({ activeDistrict: id }),
}));
