import { Actions } from '../../store/actions';
import { useStateValue } from '../../store/AppDataProvider';
import { DEFAULT_MEMBERS } from '../../constants';

export type Page = 'dashboard' | 'my-tasks' | 'team' | 'projects';

const currentUser = DEFAULT_MEMBERS[0];

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export const Sidebar = ({ activePage, onNavigate }: SidebarProps) => {
  const [{ theme }, dispatcher] = useStateValue();

  const toggleTheme = () =>
    dispatcher({ type: Actions.SET_THEME, payload: theme === 'light' ? 'dark' : 'light' });

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-tight">TaskBoard</span>
        </div>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.photo}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">{currentUser.name}</p>
            <p className="text-[10px] text-gray-400 truncate">Developer</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <NavItem
          icon={<DashboardIcon />}
          label="Dashboard"
          active={activePage === 'dashboard'}
          onClick={() => onNavigate('dashboard')}
        />
        <NavItem
          icon={<TasksIcon />}
          label="My Tasks"
          active={activePage === 'my-tasks'}
          onClick={() => onNavigate('my-tasks')}
        />
        <NavItem
          icon={<TeamIcon />}
          label="Team"
          active={activePage === 'team'}
          onClick={() => onNavigate('team')}
        />
        <NavItem
          icon={<ProjectsIcon />}
          label="Projects"
          active={activePage === 'projects'}
          onClick={() => onNavigate('projects')}
        />
      </nav>

      {/* Shortcuts */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 space-y-1.5">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Shortcuts</p>
        {[
          ['N', 'New task'],
          ['/', 'Search'],
          ['D', 'Dark mode'],
          ['Esc', 'Close'],
        ].map(([key, label]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400">{label}</span>
            <kbd className="text-[9px] font-mono bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded px-1.5 py-0.5">
              {key}
            </kbd>
          </div>
        ))}
      </div>

      {/* Dark mode */}
      <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors
      ${active
        ? 'bg-accent/10 text-accent'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200'
      }`}
  >
    <span className="w-4 h-4">{icon}</span>
    {label}
  </button>
);

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const TasksIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>
);

const TeamIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const ProjectsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const SunIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);
