import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Sidebar, Page } from './components/Sidebar/Sidebar';
import { Board } from './components/Board/Board';
import { FilterBar } from './components/Filters/FilterBar';
import { FilterSidebar } from './components/Filters/FilterSidebar';
import { TaskModal } from './components/Modal/TaskModal';
import { AnalyticsPanel } from './components/Analytics/AnalyticsPanel';
import { MyTasksPage } from './components/Pages/MyTasksPage';
import { TeamPage } from './components/Pages/TeamPage';
import { ProjectsPage } from './components/Pages/ProjectsPage';
import { useStateValue } from './store/AppDataProvider';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Actions } from './store/actions';

const PAGE_TITLES: Record<Page, string> = {
  dashboard: 'UI Design',
  'my-tasks': 'My Tasks',
  team: 'Team',
  projects: 'Projects',
};

function App() {
  const [{ theme, selectedTicket, saveTicket, projectLanes, tickets, projects, activeProjectId }, dispatcher] = useStateValue();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [showFilters, setShowFilters] = useState(true);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleNewTask = useCallback(() => {
    const firstLane = projectLanes[0];
    if (!firstLane) return;
    setActivePage('dashboard');
    dispatcher({ type: Actions.UNSELECT_TICKET });
    dispatcher({ type: Actions.SHOW_SAVE_TICKET, payload: { laneId: firstLane.id } });
  }, [dispatcher, projectLanes]);

  const handleClose = useCallback(() => {
    if (saveTicket.show) dispatcher({ type: Actions.HIDE_SAVE_TICKET });
    else if (selectedTicket) dispatcher({ type: Actions.UNSELECT_TICKET });
  }, [dispatcher, saveTicket.show, selectedTicket]);

  const handleFocusSearch = useCallback(() => {
    setActivePage('dashboard');
    setTimeout(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    }, 50);
  }, []);

  const handleToggleTheme = useCallback(() => {
    dispatcher({ type: Actions.SET_THEME, payload: theme === 'light' ? 'dark' : 'light' });
  }, [dispatcher, theme]);

  useKeyboardShortcuts({
    n: handleNewTask,
    '/': handleFocusSearch,
    d: handleToggleTheme,
    Escape: handleClose,
  });

  const isDashboard = activePage === 'dashboard';

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA] dark:bg-gray-950">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3.5 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div>
            {isDashboard ? (
              <ProjectDropdown
                projects={projects}
                activeProjectId={activeProjectId}
                onSelect={id => dispatcher({ type: Actions.SET_ACTIVE_PROJECT, payload: id })}
              />
            ) : (
              <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {PAGE_TITLES[activePage]}
              </h1>
            )}
            {isDashboard && (
              <p className="text-xs text-gray-400 mt-0.5">
                Project board · {Object.keys(tickets).length} tasks
              </p>
            )}
          </div>
        </header>

        {/* Dashboard-only analytics + search */}
        {isDashboard && <AnalyticsPanel />}
        {isDashboard && (
          <FilterBar
            searchInputRef={searchInputRef}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(v => !v)}
          />
        )}

        {/* Page content */}
        <main className="flex-1 overflow-hidden flex">
          {activePage === 'dashboard' && (
            <>
              <div className="flex-1 overflow-auto">
                <Board />
              </div>
              <FilterSidebar open={showFilters} />
            </>
          )}
          {activePage === 'my-tasks' && <MyTasksPage />}
          {activePage === 'team' && <TeamPage />}
          {activePage === 'projects' && <ProjectsPage />}
        </main>
      </div>

      {/* Task modal — available on all pages */}
      <TaskModal />
    </div>
  );
}

interface ProjectDropdownProps {
  projects: Record<string, import('./types').Project>;
  activeProjectId: string | null;
  onSelect: (id: string | null) => void;
}

const ProjectDropdown = ({ projects, activeProjectId, onSelect }: ProjectDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const projectList = Object.values(projects);
  const active = activeProjectId ? projects[activeProjectId] : null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.left });
    }
    setOpen(o => !o);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleOpen}
        style={active ? { backgroundColor: active.color } : undefined}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-semibold transition-colors ${
          active
            ? 'text-white'
            : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        {active ? active.name : 'All Projects'}
        <ChevronDownIcon />
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          style={{ top: menuPos.top, left: menuPos.left }}
          className="fixed bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[9999] py-1 min-w-[180px]"
        >
          <button
            onClick={() => { onSelect(null); setOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
              activeProjectId === null ? 'text-accent font-medium' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
            All Projects
          </button>
          {projectList.map(p => (
            <button
              key={p.id}
              onClick={() => { onSelect(p.id); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                activeProjectId === p.id ? 'text-accent font-medium' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: p.color }} />
              {p.name}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default App;
