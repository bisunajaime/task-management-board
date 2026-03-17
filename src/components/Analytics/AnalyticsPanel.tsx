import { useMemo } from 'react';
import { useStateValue } from '../../store/AppDataProvider';
import { COMPLETED_LANE_TITLES, PRIORITY_CONFIG, PRIORITIES } from '../../constants';
import { isOverdue } from '../../utils/date';

export const AnalyticsPanel = () => {
  const [{ projectLanes, tickets, activeProjectId }] = useStateValue();

  const stats = useMemo(() => {
    const allTickets = Object.values(tickets).filter(
      t => activeProjectId === null || t.projectId === activeProjectId,
    );
    const total = allTickets.length;

    const byLane = projectLanes.map(lane => ({
      id: lane.id,
      title: lane.title,
      count: lane.ticketIds.filter(id => tickets[id] && (activeProjectId === null || tickets[id].projectId === activeProjectId)).length,
    }));

    const completed = byLane
      .filter(l => COMPLETED_LANE_TITLES.some(t => l.title.toLowerCase().includes(t.toLowerCase())))
      .reduce((sum, l) => sum + l.count, 0);

    const byPriority = PRIORITIES.map(p => ({
      priority: p,
      count: allTickets.filter(t => t.priority === p).length,
    }));

    const overdue = allTickets.filter(t => isOverdue(t.dueDate)).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, byLane, byPriority, overdue, completionRate, completed };
  }, [projectLanes, tickets, activeProjectId]);

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Total tasks — always visible */}
        <StatCard label="Total tasks" value={stats.total} />

        {/* Completed — always visible */}
        <StatCard
          label="Completed"
          value={`${stats.completionRate}%`}
          sub={`${stats.completed} tasks`}
          accent
        />

        {/* Overdue — hidden on mobile */}
        <div className="hidden md:block">
          <StatCard
            label="Overdue"
            value={stats.overdue}
            danger={stats.overdue > 0}
          />
        </div>

        {/* By priority — hidden on mobile */}
        <div className="hidden md:block">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">By priority</p>
          <div className="space-y-1.5">
            {stats.byPriority.map(({ priority, count }) => {
              const cfg = PRIORITY_CONFIG[priority];
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={priority} className="flex items-center gap-2">
                  <span className="text-[10px] font-medium w-14 flex-shrink-0" style={{ color: cfg.color }}>
                    {priority}
                  </span>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: cfg.color }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 w-4 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  danger?: boolean;
}

const StatCard = ({ label, value, sub, accent, danger }: StatCardProps) => (
  <div>
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
    <p className={`text-2xl font-semibold ${accent ? 'text-accent' : danger ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'}`}>
      {value}
    </p>
    {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
  </div>
);
