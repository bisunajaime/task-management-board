import { Member, Priority, TaskType } from '../types';

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bg: string; dot: string }
> = {
  Critical: { label: 'Critical', color: '#DC2626', bg: '#FEF2F2', dot: 'bg-red-600' },
  High:     { label: 'High',     color: '#EA580C', bg: '#FFF7ED', dot: 'bg-orange-600' },
  Medium:   { label: 'Medium',   color: '#CA8A04', bg: '#FEFCE8', dot: 'bg-yellow-600' },
  Low:      { label: 'Low',      color: '#16A34A', bg: '#F0FDF4', dot: 'bg-green-600' },
};

export const PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low'];

export const LS_KEY = 'tmb-state-v2';

export const DEFAULT_MEMBERS: Member[] = [
  {
    id: 'member-1',
    name: 'Monica',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'member-2',
    name: 'Brad',
    photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'member-3',
    name: 'Owen',
    photo: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'member-4',
    name: 'Jason',
    photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  },
];

export const COMPLETED_LANE_TITLES = ['Completed', 'Live', 'Done', 'Shipped'];

export const TASK_TYPES: TaskType[] = [
  'Bug', 'Feature', 'Improvement', 'Design', 'Documentation', 'Test', 'Chore',
];

export const TASK_TYPE_CONFIG: Record<TaskType, { label: string; color: string; bg: string; darkBg: string }> = {
  Bug:           { label: 'Bug',           color: '#DC2626', bg: '#FEF2F2', darkBg: '#450a0a' },
  Feature:       { label: 'Feature',       color: '#2563EB', bg: '#EFF6FF', darkBg: '#172554' },
  Improvement:   { label: 'Improvement',   color: '#7C3AED', bg: '#F5F3FF', darkBg: '#2e1065' },
  Design:        { label: 'Design',        color: '#DB2777', bg: '#FDF2F8', darkBg: '#500724' },
  Documentation: { label: 'Docs',          color: '#0891B2', bg: '#ECFEFF', darkBg: '#083344' },
  Test:          { label: 'Test',          color: '#059669', bg: '#ECFDF5', darkBg: '#022c22' },
  Chore:         { label: 'Chore',         color: '#6B7280', bg: '#F9FAFB', darkBg: '#111827' },
};

export const PROJECT_COLORS = [
  '#2563EB', '#7C3AED', '#DB2777', '#059669', '#D97706', '#DC2626', '#0891B2',
];
