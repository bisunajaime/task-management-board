import { useCallback, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '../UI/Badge';
import { AvatarStack } from '../UI/Avatar';
import { Actions } from '../../store/actions';
import { useStateValue } from '../../store/AppDataProvider';
import { Ticket } from '../../types';
import { TASK_TYPE_CONFIG } from '../../constants';
import { formatDate, isOverdue } from '../../utils/date';

interface CardProps {
  ticket: Ticket;
  laneId: string;
  isDragOverlay?: boolean;
}

export const Card = ({ ticket, laneId, isDragOverlay = false }: CardProps) => {
  const [{ selectedTicket, projects }, dispatcher] = useStateValue();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleRef = useRef<HTMLParagraphElement>(null);

  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id: ticket.id, data: { type: 'card', laneId } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedTicket?.id === ticket.id;
  const overdue = isOverdue(ticket.dueDate);
  const project = ticket.projectId ? projects[ticket.projectId] ?? null : null;

  const handleClick = useCallback(() => {
    if (isEditingTitle) return;
    dispatcher({
      type: Actions.SELECT_TICKET,
      payload: isSelected ? null : { details: ticket, lane: laneId },
    });
  }, [dispatcher, isEditingTitle, isSelected, laneId, ticket]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingTitle(true);
    setTimeout(() => titleRef.current?.focus(), 0);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    const newTitle = titleRef.current?.textContent?.trim() ?? '';
    if (newTitle && newTitle !== ticket.title) {
      dispatcher({
        type: Actions.UPDATE_TICKET,
        payload: { id: ticket.id, changes: { title: newTitle } },
      });
    }
    // Restore original if empty
    if (!newTitle && titleRef.current) {
      titleRef.current.textContent = ticket.title;
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      titleRef.current?.blur();
    }
    if (e.key === 'Escape') {
      if (titleRef.current) titleRef.current.textContent = ticket.title;
      setIsEditingTitle(false);
    }
  };

  if (isDragging && !isDragOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[120px] rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      className={`
        group relative bg-white dark:bg-gray-800 rounded-lg border
        select-none transition-all duration-150 overflow-hidden
        ${isSelected
          ? 'border-accent ring-1 ring-accent/20 shadow-sm'
          : 'border-gray-200 dark:border-gray-700 shadow-card hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
        }
        ${isDragOverlay ? 'rotate-1 shadow-xl opacity-95' : ''}
      `}
    >
      {/* Drag handle */}
      {/* Project banner with drag handle */}
      {project ? (
        <div
          className="w-full flex items-center justify-between px-3 py-1"
          style={{ backgroundColor: project.color }}
        >
          <span className="text-[10px] font-semibold tracking-wide text-white truncate">{project.name}</span>
          <div
            {...attributes}
            {...listeners}
            className="opacity-50 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity text-white ml-2 flex-shrink-0"
          >
            <DragIcon />
          </div>
        </div>
      ) : (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
        >
          <DragIcon />
        </div>
      )}

      <div className="p-3.5 pr-5">
      {/* Tags */}
      {ticket.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {ticket.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] rounded font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Priority + Type */}
      <div className="flex items-center gap-1.5 mb-2">
        <Badge priority={ticket.priority} size="sm" />
        <TypeChip type={ticket.type} />
      </div>

      {/* Title */}
      <p
        ref={titleRef}
        contentEditable={isEditingTitle}
        suppressContentEditableWarning
        onDoubleClick={handleDoubleClick}
        onBlur={handleTitleBlur}
        onKeyDown={handleTitleKeyDown}
        className={`
          text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug mb-2
          ${isEditingTitle
            ? 'outline-none border-b border-accent pb-0.5'
            : 'line-clamp-2'
          }
        `}
      >
        {ticket.title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <AvatarStack members={ticket.members} max={3} size="sm" />
        {ticket.dueDate && (
          <span
            className={`text-[10px] font-medium ${
              overdue ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {overdue ? '⚠ ' : ''}{formatDate(ticket.dueDate)}
          </span>
        )}
      </div>
      </div>
    </div>
  );
};

const DragIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/>
    <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
    <circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
  </svg>
);

const TypeChip = ({ type }: { type: Ticket['type'] }) => {
  const cfg = TASK_TYPE_CONFIG[type];
  return (
    <span
      className="px-1.5 py-0.5 text-[10px] font-medium rounded"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
};

