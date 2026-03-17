import { useState } from 'react';
import { useStateValue } from '../../store/AppDataProvider';
import { Actions } from '../../store/actions';
import { Project } from '../../types';
import { DEFAULT_MEMBERS, PROJECT_COLORS, TASK_TYPE_CONFIG } from '../../constants';
import { Badge } from '../UI/Badge';
import { v4 as uuidv4 } from 'uuid';
import { nowISO } from '../../utils/date';

export const ProjectsPage = () => {
  const [{ projects, tickets, projectLanes }, dispatcher] = useStateValue();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const projectList = Object.values(projects);
  const selectedProject = selectedProjectId ? projects[selectedProjectId] : null;

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        tickets={tickets}
        projectLanes={projectLanes}
        onBack={() => setSelectedProjectId(null)}
        onUpdate={changes =>
          dispatcher({ type: Actions.UPDATE_PROJECT, payload: { id: selectedProject.id, changes } })
        }
        onDelete={() => {
          dispatcher({ type: Actions.DELETE_PROJECT, payload: selectedProject.id });
          setSelectedProjectId(null);
        }}
      />
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Projects</h1>
          <p className="text-sm text-gray-400 mt-0.5">{projectList.length} project{projectList.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent/90 transition-colors"
        >
          <PlusIcon /> New project
        </button>
      </div>

      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreate={project => {
            dispatcher({ type: Actions.ADD_PROJECT, payload: { project } });
            setShowCreate(false);
          }}
        />
      )}

      {projectList.length === 0 ? (
        <EmptyState onNew={() => setShowCreate(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectList.map(project => {
            const projectTickets = Object.values(tickets).filter(t => t.projectId === project.id);
            const members = DEFAULT_MEMBERS.filter(m => project.memberIds.includes(m.id));
            return (
              <ProjectCard
                key={project.id}
                project={project}
                ticketCount={projectTickets.length}
                members={members}
                onClick={() => setSelectedProjectId(project.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Project Card ─────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: Project;
  ticketCount: number;
  members: typeof DEFAULT_MEMBERS;
  onClick: () => void;
}

const ProjectCard = ({ project, ticketCount, members, onClick }: ProjectCardProps) => (
  <button
    onClick={onClick}
    className="text-left bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all group"
  >
    {/* Color bar */}
    <div className="h-1 rounded-full mb-4" style={{ backgroundColor: project.color }} />

    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-accent transition-colors mb-1 truncate">
      {project.name}
    </h3>
    {project.description && (
      <p className="text-xs text-gray-400 line-clamp-2 mb-4">{project.description}</p>
    )}

    <div className="flex items-center justify-between">
      {/* Member avatars */}
      <div className="flex -space-x-1.5">
        {members.slice(0, 4).map(m => (
          <img
            key={m.id}
            src={m.photo}
            alt={m.name}
            title={m.name}
            className="w-6 h-6 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
          />
        ))}
        {members.length > 4 && (
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800 flex items-center justify-center">
            <span className="text-[9px] font-medium text-gray-600 dark:text-gray-400">+{members.length - 4}</span>
          </div>
        )}
      </div>
      <span className="text-xs text-gray-400">{ticketCount} task{ticketCount !== 1 ? 's' : ''}</span>
    </div>
  </button>
);

// ─── Project Detail ───────────────────────────────────────────────────────────

interface ProjectDetailProps {
  project: Project;
  tickets: ReturnType<typeof useStateValue>[0]['tickets'];
  projectLanes: ReturnType<typeof useStateValue>[0]['projectLanes'];
  onBack: () => void;
  onUpdate: (changes: Partial<Project>) => void;
  onDelete: () => void;
}

const ProjectDetail = ({ project, tickets, projectLanes, onBack, onUpdate, onDelete }: ProjectDetailProps) => {
  const [, dispatcher] = useStateValue();
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(project.name);
  const [desc, setDesc] = useState(project.description);

  const projectTickets = Object.values(tickets).filter(t => t.projectId === project.id);
  const members = DEFAULT_MEMBERS.filter(m => project.memberIds.includes(m.id));
  const nonMembers = DEFAULT_MEMBERS.filter(m => !project.memberIds.includes(m.id));

  const openTicket = (ticket: typeof projectTickets[number]) => {
    const lane = projectLanes.find(l => l.ticketIds.includes(ticket.id));
    if (!lane) return;
    dispatcher({ type: Actions.SELECT_TICKET, payload: { details: ticket, lane: lane.id } });
  };

  const saveName = () => {
    setEditingName(false);
    if (name.trim() && name !== project.name) onUpdate({ name: name.trim() });
  };

  const typeBreakdown = TASK_TYPE_CONFIG ? Object.entries(
    projectTickets.reduce<Record<string, number>>((acc, t) => {
      acc[t.type] = (acc[t.type] ?? 0) + 1;
      return acc;
    }, {})
  ) : [];

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5 transition-colors"
      >
        <ChevronLeftIcon /> All projects
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0 mr-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }} />
            {editingName ? (
              <input
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={saveName}
                onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') { setName(project.name); setEditingName(false); } }}
                className="text-xl font-semibold bg-transparent border-b border-accent outline-none text-gray-900 dark:text-gray-100 min-w-0 flex-1"
              />
            ) : (
              <h1
                className="text-xl font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-accent transition-colors"
                onDoubleClick={() => setEditingName(true)}
              >
                {project.name}
              </h1>
            )}
          </div>
          <input
            value={desc}
            onChange={e => setDesc(e.target.value)}
            onBlur={() => { if (desc !== project.description) onUpdate({ description: desc }); }}
            placeholder="Add a description…"
            className="text-sm text-gray-400 bg-transparent outline-none w-full placeholder:text-gray-300 dark:placeholder:text-gray-600"
          />
        </div>
        <button
          onClick={() => { if (window.confirm(`Delete "${project.name}"?`)) onDelete(); }}
          className="text-xs text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
        >
          Delete project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tasks ({projectTickets.length})
            </h2>
          </div>

          {projectTickets.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No tasks in this project yet.</p>
          ) : (
            <div className="space-y-2">
              {projectTickets.map(ticket => {
                const lane = projectLanes.find(l => l.ticketIds.includes(ticket.id));
                return (
                  <button
                    key={ticket.id}
                    onClick={() => openTicket(ticket)}
                    className="w-full flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-4 py-2.5 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all text-left group"
                  >
                    <Badge priority={ticket.priority} size="sm" />
                    <TypeBadge type={ticket.type} />
                    <span className="flex-1 text-sm text-gray-800 dark:text-gray-200 truncate group-hover:text-accent transition-colors">
                      {ticket.title}
                    </span>
                    {lane && (
                      <span className="text-xs text-gray-400 flex-shrink-0">{lane.title}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Type breakdown */}
          {typeBreakdown.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">By type</p>
              <div className="flex flex-wrap gap-2">
                {typeBreakdown.map(([type, count]) => {
                  const cfg = TASK_TYPE_CONFIG[type as keyof typeof TASK_TYPE_CONFIG];
                  return (
                    <div key={type} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ backgroundColor: cfg.bg }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                      <span className="text-xs font-medium" style={{ color: cfg.color }}>{count} {cfg.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Members */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Members</h2>
            {nonMembers.length > 0 && (
              <button
                onClick={() => setShowAddMember(v => !v)}
                className="text-xs text-accent hover:underline"
              >
                Add
              </button>
            )}
          </div>

          <div className="space-y-2">
            {members.map(m => (
              <div key={m.id} className="flex items-center gap-3 py-1.5">
                <img src={m.photo} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">{m.name}</span>
                <button
                  onClick={() => onUpdate({ memberIds: project.memberIds.filter(id => id !== m.id) })}
                  className="text-xs text-gray-300 hover:text-red-400 transition-colors"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {showAddMember && nonMembers.length > 0 && (
            <div className="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {nonMembers.map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    onUpdate({ memberIds: [...project.memberIds, m.id] });
                    setShowAddMember(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <img src={m.photo} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{m.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Create Project Modal ─────────────────────────────────────────────────────

interface CreateProjectModalProps {
  onClose: () => void;
  onCreate: (project: Project) => void;
}

const CreateProjectModal = ({ onClose, onCreate }: CreateProjectModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PROJECT_COLORS[0]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([DEFAULT_MEMBERS[0].id]);
  const [error, setError] = useState('');

  const toggleMember = (id: string) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!name.trim()) { setError('Name is required.'); return; }
    const project: Project = {
      id: uuidv4(),
      name: name.trim(),
      description,
      color,
      memberIds: selectedMembers,
      ticketIds: [],
      createdAt: nowISO(),
    };
    onCreate(project);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-modal w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">New project</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <CloseIcon />
            </button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Name *</label>
              <input
                autoFocus
                value={name}
                onChange={e => { setName(e.target.value); setError(''); }}
                placeholder="Project name"
                className="w-full text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent text-gray-900 dark:text-gray-100"
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What is this project about?"
                rows={2}
                className="w-full text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent text-gray-900 dark:text-gray-100 resize-none"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Color</label>
              <div className="flex gap-2">
                {PROJECT_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c,
                      outline: color === c ? `2px solid ${c}` : 'none',
                      outlineOffset: '2px',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Members */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Members</label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_MEMBERS.map(m => {
                  const active = selectedMembers.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleMember(m.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs transition-all ${
                        active
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <img src={m.photo} alt={m.name} className="w-4 h-4 rounded-full object-cover" />
                      {m.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCreate}
              className="flex-1 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors"
            >
              Create project
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Small helpers ────────────────────────────────────────────────────────────

const TypeBadge = ({ type }: { type: string }) => {
  const cfg = TASK_TYPE_CONFIG[type as keyof typeof TASK_TYPE_CONFIG];
  if (!cfg) return null;
  return (
    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded flex-shrink-0" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
      {cfg.label}
    </span>
  );
};

const EmptyState = ({ onNew }: { onNew: () => void }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
      <FolderIcon />
    </div>
    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No projects yet</p>
    <p className="text-xs text-gray-400 mt-1 mb-4">Group tasks into projects to keep things organised.</p>
    <button
      onClick={onNew}
      className="px-4 py-2 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent/90 transition-colors"
    >
      Create your first project
    </button>
  </div>
);

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);
