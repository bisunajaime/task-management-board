import { useEffect, useRef, useState } from 'react';
import { RichTextEditor } from '../UI/RichTextEditor';
import { Badge } from '../UI/Badge';
import { AvatarStack } from '../UI/Avatar';
import { Button } from '../UI/Button';
import { Actions } from '../../store/actions';
import { useStateValue } from '../../store/AppDataProvider';
import { Comment, Priority, TaskType, Ticket } from '../../types';
import { PRIORITIES, PRIORITY_CONFIG, DEFAULT_MEMBERS, TASK_TYPES, TASK_TYPE_CONFIG } from '../../constants';
import { formatRelative, isOverdue, nowISO } from '../../utils/date';
import { getRandomImage } from '../../services/UnsplashApiService';
import { v4 as uuidv4 } from 'uuid';

export const TaskModal = () => {
  const [{ selectedTicket, saveTicket }, dispatcher] = useStateValue();
  const isCreateMode = saveTicket.show;
  const isViewMode = selectedTicket !== null && !isCreateMode;
  const isOpen = isViewMode || isCreateMode;

  // Separate "mounted" from "open" so the exit animation can play before unmounting
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Two rAFs ensure the initial translate-x-full paint happens before we
      // flip to translate-x-0, giving the browser a frame to start the transition
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimateIn(true))
      );
    } else {
      setAnimateIn(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!mounted) return null;

  const close = () => {
    if (isCreateMode) dispatcher({ type: Actions.HIDE_SAVE_TICKET });
    else dispatcher({ type: Actions.UNSELECT_TICKET });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${
          animateIn ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={close}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-[560px] bg-white dark:bg-gray-900 shadow-modal z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out ${
          animateIn ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {isCreateMode && (
          <CreateTaskPanel
            laneId={saveTicket.laneId ?? ''}
            existingTicket={saveTicket.ticket ?? undefined}
            onClose={close}
          />
        )}
        {isViewMode && selectedTicket && (
          <ViewTaskPanel ticket={selectedTicket} onClose={close} />
        )}
      </div>
    </>
  );
};

// ─── View Mode ────────────────────────────────────────────────────────────────

interface ViewTaskPanelProps {
  ticket: Ticket & { lane: string };
  onClose: () => void;
}

const ViewTaskPanel = ({ ticket, onClose }: ViewTaskPanelProps) => {
  const [{ projectLanes }, dispatcher] = useStateValue();
  const [editingDesc, setEditingDesc] = useState(false);
  const [localDesc, setLocalDesc] = useState(ticket.description);

  useEffect(() => {
    setLocalDesc(ticket.description);
    setEditingDesc(false);
  }, [ticket.id, ticket.description]);

  const saveDescription = () => {
    setEditingDesc(false);
    if (localDesc !== ticket.description) {
      dispatcher({ type: Actions.UPDATE_TICKET, payload: { id: ticket.id, changes: { description: localDesc } } });
    }
  };

  const handleLaneChange = (laneId: string) => {
    if (laneId !== ticket.lane) {
      dispatcher({ type: Actions.MOVE_TICKET, payload: { prevLane: ticket.lane, newLane: laneId, ticketId: ticket.id } });
    }
  };

  const handlePriorityChange = (priority: Priority) => {
    dispatcher({ type: Actions.UPDATE_TICKET_PRIORITY, payload: { ticketId: ticket.id, priority } });
  };

  const handleDueDateChange = (date: string) => {
    dispatcher({ type: Actions.UPDATE_TICKET, payload: { id: ticket.id, changes: { dueDate: date || null } } });
  };

  const overdue = isOverdue(ticket.dueDate);

  return (
    <>
      {/* Cover image */}
      {ticket.photo && (
        <div className="relative h-40 flex-shrink-0 overflow-hidden">
          <img src={ticket.photo} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <PriorityPicker priority={ticket.priority} onChange={handlePriorityChange} />
          <TypePicker
            type={ticket.type}
            onChange={t => dispatcher({ type: Actions.UPDATE_TICKET, payload: { id: ticket.id, changes: { type: t } } })}
          />
          <span className="text-xs text-gray-400 font-mono">{ticket.id.slice(0, 8)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatcher({ type: Actions.SHOW_SAVE_TICKET, payload: { ticket, laneId: ticket.lane } })}
          >
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <CloseIcon />
          </Button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-hide">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
          {ticket.title}
        </h2>

        {/* Meta row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">Status</p>
            <select
              value={ticket.lane}
              onChange={e => handleLaneChange(e.target.value)}
              className="text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {projectLanes.map(l => (
                <option key={l.id} value={l.id}>{l.title}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">Due date</p>
            <input
              type="date"
              value={ticket.dueDate ?? ''}
              onChange={e => handleDueDateChange(e.target.value)}
              className={`text-sm bg-gray-50 dark:bg-gray-800 border rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-accent
                ${overdue ? 'border-red-300 text-red-600' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200'}`}
            />
          </div>
        </div>

        {/* Tags */}
        {ticket.tags.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {ticket.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Members */}
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Members</p>
          <AvatarStack members={ticket.members} max={6} size="md" />
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Description</p>
            {!editingDesc && (
              <button
                onClick={() => setEditingDesc(true)}
                className="text-xs text-accent hover:underline"
              >
                Edit
              </button>
            )}
          </div>
          {editingDesc ? (
            <div>
              <RichTextEditor content={localDesc} onChange={setLocalDesc} editable />
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={saveDescription}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => { setLocalDesc(ticket.description); setEditingDesc(false); }}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div
              className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 -mx-2 transition-colors"
              onClick={() => setEditingDesc(true)}
            >
              {ticket.description
                ? <RichTextEditor content={ticket.description} editable={false} />
                : <span className="text-gray-400 italic">No description. Click to add one.</span>
              }
            </div>
          )}
        </div>

        {/* Comments */}
        <CommentsSection ticket={ticket} />

        {/* Activity */}
        {ticket.activity.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Activity</p>
            <div className="space-y-2">
              {[...ticket.activity].reverse().map(entry => (
                <div key={entry.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 dark:text-gray-300">{entry.action}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{formatRelative(entry.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// ─── Comments ─────────────────────────────────────────────────────────────────

const CURRENT_USER = {
  id: 'member-1',
  name: 'Monica',
  photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
};

interface CommentsSectionProps {
  ticket: Ticket;
}

const CommentsSection = ({ ticket }: CommentsSectionProps) => {
  const [, dispatcher] = useStateValue();
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const comments: Comment[] = ticket.comments ?? [];

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const comment: Comment = {
      id: uuidv4(),
      text: trimmed,
      authorId: CURRENT_USER.id,
      authorName: CURRENT_USER.name,
      authorPhoto: CURRENT_USER.photo,
      timestamp: nowISO(),
    };
    dispatcher({ type: Actions.ADD_COMMENT, payload: { ticketId: ticket.id, comment } });
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
        Comments {comments.length > 0 && <span className="text-gray-300">({comments.length})</span>}
      </p>

      {/* Existing comments */}
      {comments.length > 0 && (
        <div className="space-y-4 mb-4">
          {comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <img
                src={c.authorPhoto}
                alt={c.authorName}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{c.authorName}</span>
                  <span className="text-[10px] text-gray-400">{formatRelative(c.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                  {c.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compose */}
      <div className="flex gap-3">
        <img
          src={CURRENT_USER.photo}
          alt={CURRENT_USER.name}
          className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-1"
        />
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment…"
            rows={2}
            className="w-full text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-accent text-gray-800 dark:text-gray-200 placeholder:text-gray-400 transition-colors"
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-gray-400">⌘ Enter to submit</span>
            <Button size="sm" onClick={submit} disabled={!text.trim()}>
              Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Create / Edit Mode ───────────────────────────────────────────────────────

interface CreateTaskPanelProps {
  laneId: string;
  existingTicket?: Ticket;
  onClose: () => void;
}

const CreateTaskPanel = ({ laneId, existingTicket, onClose }: CreateTaskPanelProps) => {
  const [{ projectLanes }, dispatcher] = useStateValue();
  const [photo, setPhoto] = useState<string>(existingTicket?.photo ?? '');
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [title, setTitle] = useState(existingTicket?.title ?? '');
  const [description, setDescription] = useState(existingTicket?.description ?? '');
  const [priority, setPriority] = useState<Priority>(existingTicket?.priority ?? 'Medium');
  const [type, setType] = useState<TaskType>(existingTicket?.type ?? 'Feature');
  const [tags, setTags] = useState<string[]>(existingTicket?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [dueDate, setDueDate] = useState(existingTicket?.dueDate ?? '');
  const [error, setError] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  const lane = projectLanes.find(l => l.id === laneId);

  useEffect(() => {
    titleRef.current?.focus();
    if (!existingTicket) loadPhoto();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPhoto = async () => {
    setLoadingPhoto(true);
    try {
      const img = await getRandomImage();
      setPhoto(img);
    } catch { /* use empty */ }
    finally { setLoadingPhoto(false); }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

  const handleSubmit = () => {
    if (!title.trim()) { setError('Title is required.'); return; }
    const ticket: Ticket = {
      id: existingTicket?.id ?? uuidv4(),
      title: title.trim(),
      description,
      priority,
      type,
      tags,
      members: existingTicket?.members ?? [...DEFAULT_MEMBERS].sort(() => Math.random() - 0.5).slice(0, 3),
      photo,
      dueDate: dueDate || null,
      assigneeId: existingTicket?.assigneeId ?? DEFAULT_MEMBERS[0].id,
      projectId: existingTicket?.projectId ?? null,
      activity: existingTicket?.activity ?? [{ id: uuidv4(), action: 'Ticket created', timestamp: nowISO() }],
      comments: existingTicket?.comments ?? [],
      createdAt: existingTicket?.createdAt ?? nowISO(),
    };
    dispatcher({ type: Actions.ADD_TICKET, payload: { ticket, laneId } });
  };

  return (
    <>
      {/* Cover */}
      <div className="relative h-36 flex-shrink-0 bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {photo
          ? <img src={photo} alt="" className="w-full h-full object-cover" />
          : <div className={`w-full h-full flex items-center justify-center text-gray-400 text-sm ${loadingPhoto ? 'animate-pulse' : ''}`}>
              {loadingPhoto ? 'Loading image…' : 'No cover image'}
            </div>
        }
        <button
          onClick={loadPhoto}
          disabled={loadingPhoto}
          className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-black/70 transition-colors disabled:opacity-50"
        >
          {loadingPhoto ? '…' : 'Random image'}
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {existingTicket ? 'Edit task' : `New task · ${lane?.title ?? ''}`}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}><CloseIcon /></Button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 scrollbar-hide">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Title *</label>
          <input
            ref={titleRef}
            value={title}
            onChange={e => { setTitle(e.target.value); setError(''); }}
            placeholder="Task title"
            className="w-full text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent text-gray-900 dark:text-gray-100"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Priority</label>
          <div className="flex gap-2 flex-wrap">
            {PRIORITIES.map(p => {
              const cfg = PRIORITY_CONFIG[p];
              return (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                    ${priority === p
                      ? 'ring-2 border-transparent'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                    }`}
                  style={priority === p ? { color: cfg.color, backgroundColor: cfg.bg, outline: `2px solid ${cfg.color}`, outlineOffset: '1px' } : {}}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Type</label>
          <div className="flex gap-2 flex-wrap">
            {TASK_TYPES.map(t => {
              const cfg = TASK_TYPE_CONFIG[t];
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all border"
                  style={type === t
                    ? { color: cfg.color, backgroundColor: cfg.bg, outline: `2px solid ${cfg.color}`, outlineOffset: '1px', borderColor: 'transparent' }
                    : { borderColor: '#E5E7EB' }
                  }
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Due date */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent text-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Tags</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full"
              >
                {tag}
                <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder="Add tag…"
              className="flex-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent text-gray-700 dark:text-gray-200"
            />
            <Button variant="outline" size="sm" onClick={addTag}>Add</Button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Description</label>
          <RichTextEditor
            content={description}
            onChange={setDescription}
            editable
            placeholder="Describe the task…"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3 flex-shrink-0">
        <Button onClick={handleSubmit} className="flex-1">
          {existingTicket ? 'Save changes' : 'Create task'}
        </Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </>
  );
};

// ─── Priority picker ──────────────────────────────────────────────────────────

interface PriorityPickerProps {
  priority: Priority;
  onChange: (p: Priority) => void;
}

const PriorityPicker = ({ priority, onChange }: PriorityPickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}>
        <Badge priority={priority} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-card z-10 py-1 min-w-[120px]">
          {PRIORITIES.map(p => (
            <button
              key={p}
              onClick={() => { onChange(p); setOpen(false); }}
              className="w-full px-3 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Badge priority={p} size="sm" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Type picker ──────────────────────────────────────────────────────────────

interface TypePickerProps {
  type: TaskType;
  onChange: (t: TaskType) => void;
}

const TypePicker = ({ type, onChange }: TypePickerProps) => {
  const [open, setOpen] = useState(false);
  const cfg = TASK_TYPE_CONFIG[type];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="px-2 py-0.5 rounded text-xs font-medium transition-colors"
        style={{ color: cfg.color, backgroundColor: cfg.bg }}
      >
        {cfg.label}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-card z-10 py-1 min-w-[140px]">
          {TASK_TYPES.map(t => {
            const c = TASK_TYPE_CONFIG[t];
            return (
              <button
                key={t}
                onClick={() => { onChange(t); setOpen(false); }}
                className="w-full px-3 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-xs text-gray-700 dark:text-gray-300">{c.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
