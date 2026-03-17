import { useRef, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './Card';
import { Actions } from '../../store/actions';
import { useStateValue } from '../../store/AppDataProvider';
import { Ticket } from '../../types';

interface ColumnProps {
  id: string;
  title: string;
  ticketIds: string[];
  tickets: Record<string, Ticket>;
  filteredIds: string[] | null;
  onAddTicket: (laneId: string) => void;
}

export const Column = ({
  id, title, ticketIds, tickets, filteredIds, onAddTicket,
}: ColumnProps) => {
  const [, dispatcher] = useStateValue();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleRef = useRef<HTMLSpanElement>(null);

  // Make column itself sortable (for column reordering)
  const {
    attributes: colAttrs,
    listeners: colListeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging: isColDragging,
  } = useSortable({ id, data: { type: 'column' } });

  // Make column a droppable zone for cards
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id, data: { type: 'column' } });

  const setRef = (el: HTMLDivElement | null) => {
    setSortableRef(el);
    setDropRef(el);
  };

  const style = { transform: CSS.Transform.toString(transform), transition };

  const visibleIds = filteredIds !== null
    ? ticketIds.filter(tid => filteredIds.includes(tid))
    : ticketIds;

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    const newTitle = titleRef.current?.textContent?.trim() ?? '';
    if (newTitle && newTitle !== title) {
      dispatcher({ type: Actions.RENAME_LANE, payload: { laneId: id, title: newTitle } });
    }
    if (!newTitle && titleRef.current) titleRef.current.textContent = title;
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); titleRef.current?.blur(); }
    if (e.key === 'Escape') {
      if (titleRef.current) titleRef.current.textContent = title;
      setIsEditingTitle(false);
    }
  };

  const handleDelete = () => {
    if (ticketIds.length > 0) {
      if (!window.confirm(`Delete column "${title}" and its ${ticketIds.length} task(s)?`)) return;
    }
    dispatcher({ type: Actions.DELETE_LANE, payload: id });
  };

  if (isColDragging) {
    return (
      <div
        ref={setRef}
        style={style}
        className="w-[300px] flex-shrink-0 h-[200px] rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30"
      />
    );
  }

  return (
    <div
      ref={setRef}
      style={style}
      className={`
        w-[300px] flex-shrink-0 flex flex-col rounded-xl
        bg-gray-50 dark:bg-gray-800/50 border
        ${isOver
          ? 'border-accent/40 bg-accent/5 dark:bg-accent/10'
          : 'border-gray-200 dark:border-gray-700'
        }
        transition-colors duration-150
      `}
    >
      {/* Column header */}
      <div className="group flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 min-w-0">
          {/* Drag handle for column */}
          <div
            {...colAttrs}
            {...colListeners}
            className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-0.5 rounded transition-opacity flex-shrink-0"
          >
            <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
              <circle cx="2" cy="2" r="1.5" /><circle cx="8" cy="2" r="1.5" />
              <circle cx="2" cy="7" r="1.5" /><circle cx="8" cy="7" r="1.5" />
              <circle cx="2" cy="12" r="1.5" /><circle cx="8" cy="12" r="1.5" />
            </svg>
          </div>
          <span
            ref={titleRef}
            contentEditable={isEditingTitle}
            suppressContentEditableWarning
            onDoubleClick={() => {
              setIsEditingTitle(true);
              setTimeout(() => titleRef.current?.focus(), 0);
            }}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            className={`text-sm font-semibold text-gray-700 dark:text-gray-200 truncate
              ${isEditingTitle ? 'outline-none border-b border-accent' : 'cursor-text'}`}
          >
            {title}
          </span>
          <span className="flex-shrink-0 text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 rounded-full px-1.5 py-0.5">
            {visibleIds.length}
          </span>
        </div>

        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
          title="Delete column"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 min-h-[60px] scrollbar-hide">
        <SortableContext items={visibleIds} strategy={verticalListSortingStrategy}>
          {visibleIds.map(tid => {
            const ticket = tickets[tid];
            if (!ticket) return null;
            return <Card key={tid} ticket={ticket} laneId={id} />;
          })}
        </SortableContext>

        {visibleIds.length === 0 && (
          <div className="flex items-center justify-center h-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-400 dark:text-gray-600">
            Drop tasks here
          </div>
        )}
      </div>

      {/* Add task button */}
      <div className="px-3 pb-3">
        <button
          onClick={() => onAddTicket(id)}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add task
        </button>
      </div>
    </div>
  );
};
