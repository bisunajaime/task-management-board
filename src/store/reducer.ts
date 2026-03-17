import { v4 as uuidv4 } from 'uuid';
import { Actions } from './actions';
import {
  AppState, Comment, FilterState, Priority, Project, SelectedTicket, TaskType, Theme, Ticket,
} from '../types';
import { DEFAULT_MEMBERS } from '../constants';
import { nowISO } from '../utils/date';
import { loadState } from '../utils/storage';

// ─── Payload interfaces ───────────────────────────────────────────────────────

interface SelectTicketPayload { details: Ticket; lane: string; }
interface AddTicketPayload    { ticket: Ticket; laneId: string; }
interface UpdateTicketPayload { id: string; changes: Partial<Ticket>; }
interface ShowSaveTicketPayload { laneId: string; ticket?: Ticket; }
interface MoveTicketPayload   { prevLane: string; newLane: string; ticketId: string; }
interface ReorderTicketPayload { laneId: string; activeId: string; overId: string; }
interface RenameLanePayload   { laneId: string; title: string; }
interface ReorderLanesPayload { activeId: string; overId: string; }
interface UpdatePriorityPayload { ticketId: string; priority: Priority; }
interface AddCommentPayload    { ticketId: string; comment: Comment; }
interface AddProjectPayload    { project: Project; }
interface UpdateProjectPayload { id: string; changes: Partial<Project>; }

// ─── Discriminated union ──────────────────────────────────────────────────────

export type AppAction =
  | { type: typeof Actions.SELECT_TICKET;          payload: SelectTicketPayload | null }
  | { type: typeof Actions.UNSELECT_TICKET;        payload?: never }
  | { type: typeof Actions.ADD_TICKET;             payload: AddTicketPayload }
  | { type: typeof Actions.UPDATE_TICKET;          payload: UpdateTicketPayload }
  | { type: typeof Actions.SHOW_SAVE_TICKET;       payload: ShowSaveTicketPayload }
  | { type: typeof Actions.HIDE_SAVE_TICKET;       payload?: never }
  | { type: typeof Actions.MOVE_TICKET;            payload: MoveTicketPayload }
  | { type: typeof Actions.REORDER_TICKET;         payload: ReorderTicketPayload }
  | { type: typeof Actions.UPDATE_TICKET_PRIORITY; payload: UpdatePriorityPayload }
  | { type: typeof Actions.ADD_LANE;               payload: string }
  | { type: typeof Actions.RENAME_LANE;            payload: RenameLanePayload }
  | { type: typeof Actions.DELETE_LANE;            payload: string }
  | { type: typeof Actions.REORDER_LANES;          payload: ReorderLanesPayload }
  | { type: typeof Actions.SET_FILTER;             payload: Partial<FilterState> }
  | { type: typeof Actions.CLEAR_FILTER;           payload?: never }
  | { type: typeof Actions.SET_THEME;              payload: Theme }
  | { type: typeof Actions.ADD_COMMENT;            payload: AddCommentPayload }
  | { type: typeof Actions.ADD_PROJECT;            payload: AddProjectPayload }
  | { type: typeof Actions.UPDATE_PROJECT;         payload: UpdateProjectPayload }
  | { type: typeof Actions.DELETE_PROJECT;         payload: string }
  | { type: typeof Actions.SET_ACTIVE_PROJECT;     payload: string | null };

export type Reducer = (state: AppState, action: AppAction) => AppState;

// ─── Initial state factory ────────────────────────────────────────────────────

const createInitialState = (): AppState => {
  const members = [...DEFAULT_MEMBERS];

  const makeTicket = (
    title: string,
    description: string,
    priority: Priority,
    type: TaskType,
    tags: string[],
    photo: string,
    projectId: string | null = null,
  ): Ticket => ({
    id: uuidv4(),
    title,
    description,
    priority,
    type,
    tags,
    members: [...members].sort(() => Math.random() - 0.5).slice(0, 3),
    photo,
    dueDate: null,
    assigneeId: members[0].id,
    projectId,
    activity: [{ id: uuidv4(), action: 'Ticket created', timestamp: nowISO() }],
    comments: [],
    createdAt: nowISO(),
  });

  const proj1Id = uuidv4();
  const proj2Id = uuidv4();

  const t1 = makeTicket(
    'Misaligned buttons',
    '<p>Some buttons are appearing off-center on certain pages, causing confusion for users who are trying to interact with them.</p>',
    'High', 'Bug',
    ['Buttons', 'Alignment', 'Bug'],
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    proj1Id,
  );
  const t2 = makeTicket(
    'Inconsistent font styles',
    '<p>Different pages are using different font styles, making the overall design look inconsistent and unprofessional.</p>',
    'Low', 'Design',
    ['Text', 'Font'],
    'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    proj1Id,
  );
  const t3 = makeTicket(
    'Poor color contrast',
    '<p>The color contrast between the text and the background is not high enough, making it difficult for users to read the content.</p>',
    'Critical', 'Improvement',
    ['Design', 'Color', 'Contrast'],
    'https://images.unsplash.com/photo-1502691876148-a84978e59af8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    proj1Id,
  );
  const t4 = makeTicket(
    'Broken links',
    '<p>There are some links within the design that are not working, leading users to dead-end pages and creating frustration.</p>',
    'Medium', 'Bug',
    ['Bug'],
    'https://images.unsplash.com/photo-1557180295-76eee20ae8aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    proj2Id,
  );
  const t5 = makeTicket(
    'Add dark mode toggle',
    '<p>Users have requested a dark mode option. Implement a toggle that persists preference to localStorage.</p>',
    'Medium', 'Feature',
    ['Feature', 'UI'],
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    proj2Id,
  );

  const proj1: Project = {
    id: proj1Id,
    name: 'UI Design',
    description: 'Visual design improvements and bug fixes.',
    color: '#2563EB',
    memberIds: members.slice(0, 3).map(m => m.id),
    ticketIds: [t1.id, t2.id, t3.id],
    createdAt: nowISO(),
  };

  const proj2: Project = {
    id: proj2Id,
    name: 'Frontend Fixes',
    description: 'Frontend bug fixes and feature work.',
    color: '#7C3AED',
    memberIds: members.map(m => m.id),
    ticketIds: [t4.id, t5.id],
    createdAt: nowISO(),
  };

  return {
    selectedTicket: null,
    project: null,
    projects: { [proj1.id]: proj1, [proj2.id]: proj2 },
    activeProjectId: null,
    projectLanes: [
      { id: uuidv4(), title: 'Backlog',     ticketIds: [t1.id] },
      { id: uuidv4(), title: 'To Do',       ticketIds: [t2.id, t3.id] },
      { id: uuidv4(), title: 'In Progress', ticketIds: [t4.id, t5.id] },
      { id: uuidv4(), title: 'Completed',   ticketIds: [] },
      { id: uuidv4(), title: 'Live',        ticketIds: [] },
    ],
    tickets: { [t1.id]: t1, [t2.id]: t2, [t3.id]: t3, [t4.id]: t4, [t5.id]: t5 },
    saveTicket: { show: false, laneId: null, ticket: null },
    searchResults: null,
    theme: 'light',
    filter: { priority: 'All', search: '', assigneeId: null, projectId: null },
  };
};

const freshInitialState = createInitialState();

// Merge persisted state with fresh initial state (handles new fields gracefully)
const buildInitialState = (): AppState => {
  const persisted = loadState();
  if (!persisted) return freshInitialState;
  return {
    ...freshInitialState,
    ...persisted,
    // Always reset transient UI state
    selectedTicket: null,
    saveTicket: { show: false, laneId: null, ticket: null },
  };
};

export const initialState: AppState = buildInitialState();

// ─── Helpers ──────────────────────────────────────────────────────────────────

const reorder = <T>(arr: T[], fromIndex: number, toIndex: number): T[] => {
  const result = [...arr];
  const [item] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, item);
  return result;
};

const applyFilter = (
  tickets: Record<string, Ticket>,
  filter: FilterState,
): Record<string, Ticket> | null => {
  const { priority, search, assigneeId, projectId } = filter;
  const isDefault = priority === 'All' && search === '' && assigneeId === null && projectId === null;
  if (isDefault) return null;

  const results: Record<string, Ticket> = {};
  const lc = search.toLowerCase();

  for (const id in tickets) {
    const t = tickets[id];
    const matchesPriority = priority === 'All' || t.priority === priority;
    const matchesSearch =
      search === '' ||
      t.title.toLowerCase().includes(lc) ||
      t.description.toLowerCase().includes(lc);
    const matchesAssignee = assigneeId === null || t.assigneeId === assigneeId;
    const matchesProject = projectId === null || t.projectId === projectId;
    if (matchesPriority && matchesSearch && matchesAssignee && matchesProject) {
      results[id] = t;
    }
  }
  return results;
};

// ─── Reducer ─────────────────────────────────────────────────────────────────

const reducer: Reducer = (state, action) => {
  switch (action.type) {

    case Actions.SELECT_TICKET: {
      const p = action.payload;
      const selectedTicket: SelectedTicket | null =
        p == null ? null : { ...p.details, lane: p.lane };
      return { ...state, saveTicket: { show: false, laneId: null, ticket: null }, selectedTicket };
    }

    case Actions.UNSELECT_TICKET:
      return { ...state, selectedTicket: null };

    case Actions.ADD_TICKET: {
      const { ticket, laneId } = action.payload;
      const laneIndex = state.projectLanes.findIndex(l => l.id === laneId);
      if (laneIndex === -1) return state;

      const lane = state.projectLanes[laneIndex];
      const updatedTickets = { ...state.tickets, [ticket.id]: ticket };
      const alreadyInLane = lane.ticketIds.includes(ticket.id);

      const updatedLanes = [...state.projectLanes];
      if (!alreadyInLane) {
        updatedLanes[laneIndex] = { ...lane, ticketIds: [...lane.ticketIds, ticket.id] };
      }

      return {
        ...state,
        tickets: updatedTickets,
        projectLanes: updatedLanes,
        selectedTicket: { ...ticket, lane: laneId },
        saveTicket: { show: false, laneId: null, ticket: null },
        searchResults: applyFilter(updatedTickets, state.filter),
      };
    }

    case Actions.UPDATE_TICKET: {
      const { id, changes } = action.payload;
      const existing = state.tickets[id];
      if (!existing) return state;
      const activityEntry: import('../types').ActivityEntry = {
        id: uuidv4(),
        action: `Updated ${Object.keys(changes).join(', ')}`,
        timestamp: nowISO(),
      };
      const updated: Ticket = {
        ...existing,
        ...changes,
        activity: [...existing.activity, activityEntry],
      };
      const updatedTickets = { ...state.tickets, [id]: updated };
      const updatedSelected =
        state.selectedTicket?.id === id
          ? { ...state.selectedTicket, ...changes }
          : state.selectedTicket;
      return {
        ...state,
        tickets: updatedTickets,
        selectedTicket: updatedSelected,
        searchResults: applyFilter(updatedTickets, state.filter),
      };
    }

    case Actions.SHOW_SAVE_TICKET:
      return {
        ...state,
        selectedTicket: null,
        saveTicket: {
          show: true,
          laneId: action.payload.laneId,
          ticket: action.payload.ticket ?? null,
        },
      };

    case Actions.HIDE_SAVE_TICKET:
      return {
        ...state,
        selectedTicket: state.saveTicket.ticket
          ? { ...state.saveTicket.ticket, lane: state.saveTicket.laneId ?? '' }
          : null,
        saveTicket: { show: false, laneId: null, ticket: null },
      };

    case Actions.MOVE_TICKET: {
      const { prevLane, newLane, ticketId } = action.payload;
      if (prevLane === newLane) return state;

      const updatedLanes = state.projectLanes.map(lane => {
        if (lane.id === prevLane) {
          return { ...lane, ticketIds: lane.ticketIds.filter(id => id !== ticketId) };
        }
        if (lane.id === newLane) {
          return { ...lane, ticketIds: [...lane.ticketIds, ticketId] };
        }
        return lane;
      });

      return {
        ...state,
        projectLanes: updatedLanes,
        selectedTicket: state.selectedTicket?.id === ticketId
          ? { ...state.selectedTicket, lane: newLane }
          : state.selectedTicket,
      };
    }

    case Actions.REORDER_TICKET: {
      const { laneId, activeId, overId } = action.payload;
      const laneIndex = state.projectLanes.findIndex(l => l.id === laneId);
      if (laneIndex === -1) return state;

      const lane = state.projectLanes[laneIndex];
      const fromIndex = lane.ticketIds.indexOf(activeId);
      const toIndex   = lane.ticketIds.indexOf(overId);
      if (fromIndex === -1 || toIndex === -1) return state;

      const updatedLanes = [...state.projectLanes];
      updatedLanes[laneIndex] = {
        ...lane,
        ticketIds: reorder(lane.ticketIds, fromIndex, toIndex),
      };
      return { ...state, projectLanes: updatedLanes };
    }

    case Actions.UPDATE_TICKET_PRIORITY: {
      const { ticketId, priority } = action.payload;
      const ticket = state.tickets[ticketId];
      if (!ticket) return state;
      const updated = { ...ticket, priority };
      const updatedTickets = { ...state.tickets, [ticketId]: updated };
      return {
        ...state,
        tickets: updatedTickets,
        selectedTicket: state.selectedTicket?.id === ticketId
          ? { ...state.selectedTicket, priority }
          : state.selectedTicket,
        searchResults: applyFilter(updatedTickets, state.filter),
      };
    }

    case Actions.ADD_LANE:
      return {
        ...state,
        projectLanes: [
          ...state.projectLanes,
          { id: uuidv4(), title: action.payload, ticketIds: [] },
        ],
      };

    case Actions.RENAME_LANE: {
      const { laneId, title } = action.payload;
      return {
        ...state,
        projectLanes: state.projectLanes.map(l =>
          l.id === laneId ? { ...l, title } : l,
        ),
      };
    }

    case Actions.DELETE_LANE: {
      const laneId = action.payload;
      const lane = state.projectLanes.find(l => l.id === laneId);
      if (!lane) return state;

      const updatedTickets = { ...state.tickets };
      lane.ticketIds.forEach(id => { delete updatedTickets[id]; });

      return {
        ...state,
        projectLanes: state.projectLanes.filter(l => l.id !== laneId),
        tickets: updatedTickets,
        selectedTicket:
          state.selectedTicket && lane.ticketIds.includes(state.selectedTicket.id)
            ? null
            : state.selectedTicket,
        searchResults: applyFilter(updatedTickets, state.filter),
      };
    }

    case Actions.REORDER_LANES: {
      const { activeId, overId } = action.payload;
      const ids = state.projectLanes.map(l => l.id);
      const fromIndex = ids.indexOf(activeId);
      const toIndex   = ids.indexOf(overId);
      if (fromIndex === -1 || toIndex === -1) return state;
      return { ...state, projectLanes: reorder(state.projectLanes, fromIndex, toIndex) };
    }

    case Actions.SET_FILTER: {
      const newFilter = { ...state.filter, ...action.payload };
      return {
        ...state,
        filter: newFilter,
        searchResults: applyFilter(state.tickets, newFilter),
      };
    }

    case Actions.CLEAR_FILTER: {
      const cleared: FilterState = { priority: 'All', search: '', assigneeId: null, projectId: state.filter.projectId };
      return { ...state, filter: cleared, searchResults: applyFilter(state.tickets, cleared) };
    }

    case Actions.ADD_COMMENT: {
      const { ticketId, comment } = action.payload;
      const ticket = state.tickets[ticketId];
      if (!ticket) return state;
      const updated = { ...ticket, comments: [...(ticket.comments ?? []), comment] };
      const updatedTickets = { ...state.tickets, [ticketId]: updated };
      const updatedSelected =
        state.selectedTicket?.id === ticketId
          ? { ...state.selectedTicket, comments: updated.comments }
          : state.selectedTicket;
      return { ...state, tickets: updatedTickets, selectedTicket: updatedSelected };
    }

    case Actions.SET_THEME:
      return { ...state, theme: action.payload };

    case Actions.ADD_PROJECT: {
      const { project } = action.payload;
      return {
        ...state,
        projects: { ...state.projects, [project.id]: project },
      };
    }

    case Actions.UPDATE_PROJECT: {
      const { id, changes } = action.payload;
      const existing = state.projects[id];
      if (!existing) return state;
      return {
        ...state,
        projects: { ...state.projects, [id]: { ...existing, ...changes } },
      };
    }

    case Actions.DELETE_PROJECT: {
      const projectId = action.payload;
      const updatedProjects = { ...state.projects };
      delete updatedProjects[projectId];
      // Disassociate tickets from the deleted project
      const updatedTickets: Record<string, Ticket> = {};
      for (const id in state.tickets) {
        const t = state.tickets[id];
        updatedTickets[id] = t.projectId === projectId ? { ...t, projectId: null } : t;
      }
      return {
        ...state,
        projects: updatedProjects,
        tickets: updatedTickets,
        activeProjectId: state.activeProjectId === projectId ? null : state.activeProjectId,
      };
    }

    case Actions.SET_ACTIVE_PROJECT: {
      const newFilter = { ...state.filter, projectId: action.payload };
      return {
        ...state,
        activeProjectId: action.payload,
        filter: newFilter,
        searchResults: applyFilter(state.tickets, newFilter),
      };
    }

    default:
      return state;
  }
};

export default reducer;
