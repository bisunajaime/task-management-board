import { AppState } from '../types';
import { LS_KEY } from '../constants';

export const loadState = (): Partial<AppState> | null => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<AppState>;
  } catch {
    return null;
  }
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // Ignore write errors (e.g. private browsing quota)
  }
};
