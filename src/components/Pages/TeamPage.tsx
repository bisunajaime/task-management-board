import { useMemo } from 'react';
import { useStateValue } from '../../store/AppDataProvider';
import { Actions } from '../../store/actions';
import { Badge } from '../UI/Badge';
import { DEFAULT_MEMBERS, PRIORITY_CONFIG } from '../../constants';
import { Ticket } from '../../types';

export const TeamPage = () => {
  const [{ tickets, projectLanes }] = useStateValue();

  const allTickets = useMemo(() => Object.values(tickets), [tickets]);

  const memberStats = useMemo(() =>
    DEFAULT_MEMBERS.map(member => {
      const assigned = allTickets.filter(
        t => t.assigneeId === member.id || t.members.some(m => m.id === member.id),
      );
      const completed = assigned.filter(t =>
        projectLanes.find(l =>
          ['Completed', 'Live', 'Done', 'Shipped'].some(title =>
            l.title.toLowerCase().includes(title.toLowerCase()),
          ) && l.ticketIds.includes(t.id),
        ),
      );
      const byPriority = {
        Critical: assigned.filter(t => t.priority === 'Critical').length,
        High:     assigned.filter(t => t.priority === 'High').length,
        Medium:   assigned.filter(t => t.priority === 'Medium').length,
        Low:      assigned.filter(t => t.priority === 'Low').length,
      };
      return { member, assigned, completed: completed.length, byPriority };
    }),
  [allTickets, projectLanes]);

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Team</h1>
        <p className="text-sm text-gray-400 mt-0.5">{DEFAULT_MEMBERS.length} members</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {memberStats.map(({ member, assigned, completed, byPriority }) => (
          <MemberCard
            key={member.id}
            member={member}
            tasks={assigned}
            completedCount={completed}
            byPriority={byPriority}
          />
        ))}
      </div>
    </div>
  );
};

interface MemberCardProps {
  member: typeof DEFAULT_MEMBERS[number];
  tasks: Ticket[];
  completedCount: number;
  byPriority: Record<string, number>;
}

const MemberCard = ({ member, tasks, completedCount, byPriority }: MemberCardProps) => {
  const [{ projectLanes }, dispatcher] = useStateValue();
  const total = tasks.length;
  const completionPct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const openTicket = (ticket: Ticket) => {
    const lane = projectLanes.find(l => l.ticketIds.includes(ticket.id));
    if (!lane) return;
    dispatcher({ type: Actions.SELECT_TICKET, payload: { details: ticket, lane: lane.id } });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5">
      {/* Member header */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={member.photo}
          alt={member.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{member.name}</p>
          <p className="text-xs text-gray-400">Developer</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{total}</p>
          <p className="text-[10px] text-gray-400">tasks</p>
        </div>
      </div>

      {/* Completion bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Completion</span>
          <span className="text-xs font-semibold text-accent">{completionPct}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Priority breakdown */}
      <div className="flex gap-3 mb-4">
        {Object.entries(byPriority).map(([priority, count]) => {
          if (count === 0) return null;
          const cfg = PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG];
          return (
            <div key={priority} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
              <span className="text-[10px] text-gray-500 dark:text-gray-400">{count} {priority}</span>
            </div>
          );
        })}
      </div>

      {/* Task list (top 3) */}
      {tasks.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Recent tasks</p>
          {tasks.slice(0, 3).map(ticket => (
            <button
              key={ticket.id}
              onClick={() => openTicket(ticket)}
              className="w-full flex items-center gap-2.5 text-left px-2.5 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <Badge priority={ticket.priority} size="sm" />
              <span className="flex-1 text-xs text-gray-700 dark:text-gray-300 truncate group-hover:text-accent transition-colors">
                {ticket.title}
              </span>
            </button>
          ))}
          {tasks.length > 3 && (
            <p className="text-[10px] text-gray-400 pl-2.5 pt-1">+{tasks.length - 3} more</p>
          )}
        </div>
      )}

      {tasks.length === 0 && (
        <p className="text-xs text-gray-400 italic text-center py-2">No tasks assigned</p>
      )}
    </div>
  );
};
