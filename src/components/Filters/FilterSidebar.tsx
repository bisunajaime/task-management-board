import { Actions } from '../../store/actions';
import { useStateValue } from '../../store/AppDataProvider';
import { Priority } from '../../types';
import { PRIORITIES, PRIORITY_CONFIG, DEFAULT_MEMBERS } from '../../constants';

interface FilterSidebarProps {
  open: boolean;
}

export const FilterSidebar = ({ open }: FilterSidebarProps) => {
  const [{ filter }, dispatcher] = useStateValue();

  const isActive = filter.priority !== 'All' || filter.assigneeId !== null;

  const setFilter = (changes: Partial<typeof filter>) =>
    dispatcher({ type: Actions.SET_FILTER, payload: changes });

  const clearFilters = () => dispatcher({ type: Actions.CLEAR_FILTER });

  return (
    <div
      className={`flex-shrink-0 border-l border-gray-100 dark:border-gray-800 overflow-hidden transition-[width] duration-200 ease-in-out ${
        open ? 'w-[200px]' : 'w-0'
      }`}
    >
      <aside className="w-[200px] h-full bg-white dark:bg-gray-900 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Filters</span>
          {isActive && (
            <button
              onClick={clearFilters}
              className="text-[10px] font-medium text-accent hover:text-accent/80 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex-1 px-4 py-4 space-y-6">
          {/* Priority */}
          <section>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Priority</p>
            <div className="space-y-0.5">
              <FilterOption
                active={filter.priority === 'All'}
                onClick={() => setFilter({ priority: 'All' })}
              >
                <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
                All
              </FilterOption>
              {PRIORITIES.map(p => (
                <FilterOption
                  key={p}
                  active={filter.priority === p}
                  onClick={() => setFilter({ priority: filter.priority === p ? 'All' : p as Priority })}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: PRIORITY_CONFIG[p].color }}
                  />
                  {p}
                </FilterOption>
              ))}
            </div>
          </section>

          {/* Assignee */}
          <section>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Assignee</p>
            <div className="space-y-0.5">
              <FilterOption
                active={filter.assigneeId === null}
                onClick={() => setFilter({ assigneeId: null })}
              >
                <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <AnyoneIcon />
                </span>
                Anyone
              </FilterOption>
              {DEFAULT_MEMBERS.map(m => (
                <FilterOption
                  key={m.id}
                  active={filter.assigneeId === m.id}
                  onClick={() => setFilter({ assigneeId: filter.assigneeId === m.id ? null : m.id })}
                >
                  <img src={m.photo} alt={m.name} className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                  <span className="truncate">{m.name}</span>
                </FilterOption>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
};

interface FilterOptionProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const FilterOption = ({ active, onClick, children }: FilterOptionProps) => (
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

const AnyoneIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);
