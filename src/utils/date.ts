import { format, isAfter, parseISO, formatDistanceToNow } from 'date-fns';

export const formatDate = (iso: string): string =>
  format(parseISO(iso), 'MMM d, yyyy');

export const formatRelative = (iso: string): string =>
  formatDistanceToNow(parseISO(iso), { addSuffix: true });

export const isOverdue = (dueDate: string | null): boolean => {
  if (!dueDate) return false;
  return isAfter(new Date(), parseISO(dueDate));
};

export const toISODate = (date: Date): string =>
  format(date, 'yyyy-MM-dd');

export const nowISO = (): string => new Date().toISOString();
