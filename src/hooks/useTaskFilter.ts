import { useMemo } from 'react';
import { FilterState, Ticket } from '../types';

export function useTaskFilter(
  tickets: Record<string, Ticket>,
  filter: FilterState,
): Record<string, Ticket> {
  return useMemo(() => {
    const { priority, search, assigneeId, projectId } = filter;
    const isDefault = priority === 'All' && search === '' && assigneeId === null && projectId === null;
    if (isDefault) return tickets;

    const lc = search.toLowerCase();
    const results: Record<string, Ticket> = {};

    for (const id in tickets) {
      const t = tickets[id];
      const matchesPriority = priority === 'All' || t.priority === priority;
      const matchesSearch =
        search === '' ||
        t.title.toLowerCase().includes(lc) ||
        t.description.toLowerCase().includes(lc) ||
        t.tags.some(tag => tag.toLowerCase().includes(lc));
      const matchesAssignee = assigneeId === null || t.assigneeId === assigneeId;
      const matchesProject = projectId === null || t.projectId === projectId;

      if (matchesPriority && matchesSearch && matchesAssignee && matchesProject) {
        results[id] = t;
      }
    }
    return results;
  }, [tickets, filter]);
}
