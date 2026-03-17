import { useMemo, useState } from 'react';
import { useStateValue } from '../../store/AppDataProvider';
import { Actions } from '../../store/actions';
import { Badge } from '../UI/Badge';
import { Project, Ticket } from '../../types';
import { formatDate, isOverdue } from '../../utils/date';
import { PRIORITIES, PRIORITY_CONFIG } from '../../constants';

const MY_MEMBER_ID = 'member-1'; // Monica — the "current user"

export const MyTasksPage = () => {
  const [{ tickets, projectLanes, projects }, dispatcher] = useStateValue();
  const [filterProjectId, setFilterProjectId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  const projectList = Object.values(projects);

  const { assigned, grouped } = useMemo(() => {
    const base = Object.values(tickets).filter(
      t => t.assigneeId === MY_MEMBER_ID || t.members.some(m => m.id === MY_MEMBER_ID),
    );
    const assigned = filterProjectId
      ? base.filter(t => t.projectId === filterProjectId)
      : base;

    const grouped: Record<string, Ticket[]> = { Critical: [], High: [], Medium: [], Low: [] };
    for (const t of assigned) grouped[t.priority].push(t);
    return { assigned, grouped };
  }, [tickets, filterProjectId]);

  const getLaneName = (ticketId: string) => {
    const lane = projectLanes.find(l => l.ticketIds.includes(ticketId));
    return lane?.title ?? '—';
  };

  const openTicket = (ticket: Ticket) => {
    const lane = projectLanes.find(l => l.ticketIds.includes(ticket.id));
    if (!lane) return;
    dispatcher({ type: Actions.SELECT_TICKET, payload: { details: ticket, lane: lane.id } });
  };

  return (
    <div className="flex-1 overflow-hidden flex">
      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Tasks</h1>
            <p className="text-sm text-gray-400 mt-0.5">{assigned.length} task{assigned.length !== 1 ? 's' : ''} assigned to you</p>
          </div>
          {projectList.length > 0 && (
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex-shrink-0 ${
                showFilters || filterProjectId !== null
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <FilterIcon />
              Filters
              {filterProjectId !== null && (
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
              )}
            </button>
          )}
        </div>

        {assigned.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            {PRIORITIES.map(priority => {
              const tasks = grouped[priority];
              if (tasks.length === 0) return null;
              const cfg = PRIORITY_CONFIG[priority];
              return (
                <section key={priority}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                    <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: cfg.color }}>
                      {priority}
                    </h2>
                    <span className="text-xs text-gray-400">({tasks.length})</span>
                  </div>
                  <div className="space-y-2">
                    {tasks.map(ticket => (
                      <TaskRow
                        key={ticket.id}
                        ticket={ticket}
                        laneName={getLaneName(ticket.id)}
                        project={ticket.projectId ? projects[ticket.projectId] ?? null : null}
                        onClick={() => openTicket(ticket)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter sidebar */}
      <div
        className={`flex-shrink-0 border-l border-gray-100 dark:border-gray-800 overflow-hidden transition-[width] duration-200 ease-in-out ${
          showFilters ? 'w-[200px]' : 'w-0'
        }`}
      >
        <aside className="w-[200px] h-full bg-white dark:bg-gray-900 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Filters</span>
            {filterProjectId !== null && (
              <button
                onClick={() => setFilterProjectId(null)}
                className="text-[10px] font-medium text-accent hover:text-accent/80 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {projectList.length > 0 && (
            <div className="px-4 py-4">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Project</p>
              <div className="space-y-0.5">
                <SidebarOption
                  active={filterProjectId === null}
                  onClick={() => setFilterProjectId(null)}
                >
                  <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
                  All
                </SidebarOption>
                {projectList.map(p => (
                  <SidebarOption
                    key={p.id}
                    active={filterProjectId === p.id}
                    onClick={() => setFilterProjectId(filterProjectId === p.id ? null : p.id)}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="truncate">{p.name}</span>
                  </SidebarOption>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

interface SidebarOptionProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const SidebarOption = ({ active, onClick, children }: SidebarOptionProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
      active
        ? 'bg-accent/8 text-accent font-medium'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200'
    }`}
  >
    {children}
  </button>
);

interface TaskRowProps {
  ticket: Ticket;
  laneName: string;
  project: Project | null;
  onClick: () => void;
}

const TaskRow = ({ ticket, laneName, project, onClick }: TaskRowProps) => {
  const overdue = isOverdue(ticket.dueDate);

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-4 py-3 cursor-pointer hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-sm transition-all group"
    >
      <Badge priority={ticket.priority} size="sm" />

      <p className="flex-1 text-sm text-gray-800 dark:text-gray-100 font-medium truncate group-hover:text-accent transition-colors">
        {ticket.title}
      </p>

      {project && (
        <span
          className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full text-white flex-shrink-0"
          style={{ backgroundColor: project.color }}
        >
          {project.name}
        </span>
      )}

      <div className="hidden md:flex gap-1 flex-shrink-0">
        {ticket.tags.slice(0, 2).map(tag => (
          <span key={tag} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] rounded font-medium">
            {tag}
          </span>
        ))}
      </div>

      <span className="hidden sm:block text-xs text-gray-400 flex-shrink-0 w-24 text-right truncate">
        {laneName}
      </span>

      {ticket.dueDate && (
        <span className={`text-xs flex-shrink-0 w-20 text-right ${overdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
          {overdue ? '⚠ ' : ''}{formatDate(ticket.dueDate)}
        </span>
      )}
    </div>
  );
};

const FilterIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
  </svg>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    </div>
    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No tasks assigned to you</p>
    <p className="text-xs text-gray-400 mt-1">Tasks assigned to you will appear here.</p>
  </div>
);
