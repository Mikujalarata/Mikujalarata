export type DistrictId = 'hub' | 'memory' | 'projects' | 'digital-city';

export type WorldQuality = 'low' | 'medium' | 'high';

export interface WorldContentEntry {
  id: string;
  title: string;
  description: string;
  type: 'memory' | 'project' | 'technology';
  destination?: DistrictId;
}
