import { Priority } from '../types';
import { PRIORITY_CONFIG } from '../constants';

export const getPriorityColor = (priority: Priority): string =>
  PRIORITY_CONFIG[priority].color;

export const getPriorityBg = (priority: Priority): string =>
  PRIORITY_CONFIG[priority].bg;
