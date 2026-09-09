import type { WorldContentEntry } from '../types';

export function validateContentEntry(entry: WorldContentEntry): boolean {
  return Boolean(
    entry.id &&
    entry.title &&
    entry.description &&
    ['memory', 'project', 'technology'].includes(entry.type),
  );
}

export function validateWorldContent(entries: WorldContentEntry[]): boolean {
  return entries.every(validateContentEntry);
}
