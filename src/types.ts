export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type Theme = 'light' | 'dark';
export type TaskType = 'Bug' | 'Feature' | 'Improvement' | 'Design' | 'Documentation' | 'Test' | 'Chore';

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  memberIds: string[];
  ticketIds: string[];
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  photo: string;
}

export interface ActivityEntry {
  id: string;
  action: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  type: TaskType;
  tags: string[];
  members: Member[];
  photo: string;
  dueDate: string | null;
  assigneeId: string | null;
  projectId: string | null;
  activity: ActivityEntry[];
  comments: Comment[];
  createdAt: string;
}

export type SelectedTicket = Ticket & { lane: string };

export interface ProjectLane {
  id: string;
  title: string;
  ticketIds: string[];
}

export interface SaveTicketState {
  show: boolean;
  laneId: string | null;
  ticket: Ticket | null;
}

export interface FilterState {
  priority: Priority | 'All';
  search: string;
  assigneeId: string | null;
  projectId: string | null;
}

export interface AppState {
  selectedTicket: SelectedTicket | null;
  project: null;
  projects: Record<string, Project>;
  activeProjectId: string | null;
  projectLanes: ProjectLane[];
  tickets: Record<string, Ticket>;
  saveTicket: SaveTicketState;
  searchResults: Record<string, Ticket> | null;
  theme: Theme;
  filter: FilterState;
}
