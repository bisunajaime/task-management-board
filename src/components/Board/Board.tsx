import { useCallback, useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Column } from './Column';
import { Card } from './Card';
import { Actions } from '../../store/actions';
import { useStateValue } from '../../store/AppDataProvider';
import { useTaskFilter } from '../../hooks/useTaskFilter';
import { Ticket } from '../../types';

export const Board = () => {
  const [{ projectLanes, tickets, filter }, dispatcher] = useStateValue();
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const filteredTickets = useTaskFilter(tickets, filter);
  const isFiltered = filter.priority !== 'All' || filter.search !== '' || filter.assigneeId !== null || filter.projectId !== null;
  const filteredIds = isFiltered ? Object.keys(filteredTickets) : null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const laneIds = useMemo(() => projectLanes.map(l => l.id), [projectLanes]);

  const findLaneOfTicket = useCallback(
    (ticketId: string): string | null => {
      const lane = projectLanes.find(l => l.ticketIds.includes(ticketId));
      return lane?.id ?? null;
    },
    [projectLanes],
  );

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'card') {
      setActiveTicket(tickets[active.id as string] ?? null);
    } else if (active.data.current?.type === 'column') {
      setActiveColumnId(active.id as string);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.data.current?.type !== 'card') return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const overIsColumn = over.data.current?.type === 'column';

    const activeLane = findLaneOfTicket(activeId);
    const overLane = overIsColumn ? overId : findLaneOfTicket(overId);
    if (!activeLane || !overLane || activeLane === overLane) return;

    dispatcher({
      type: Actions.MOVE_TICKET,
      payload: { prevLane: activeLane, newLane: overLane, ticketId: activeId },
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTicket(null);
    setActiveColumnId(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeType = active.data.current?.type;

    if (activeType === 'column') {
      if (activeId !== overId) {
        dispatcher({ type: Actions.REORDER_LANES, payload: { activeId, overId } });
      }
      return;
    }

    if (activeType === 'card') {
      const overIsColumn = over.data.current?.type === 'column';
      if (!overIsColumn && activeId !== overId) {
        const laneId = findLaneOfTicket(activeId);
        if (laneId) {
          dispatcher({
            type: Actions.REORDER_TICKET,
            payload: { laneId, activeId, overId },
          });
        }
      }
    }
  };

  const handleAddTicket = (laneId: string) => {
    dispatcher({ type: Actions.UNSELECT_TICKET });
    dispatcher({ type: Actions.SHOW_SAVE_TICKET, payload: { laneId } });
  };

  const handleAddLane = () => {
    const title = prompt('Enter column name:');
    if (!title?.trim()) return;
    dispatcher({ type: Actions.ADD_LANE, payload: title.trim() });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-4 p-6 overflow-x-auto min-h-full scrollbar-hide">
        <SortableContext items={laneIds} strategy={horizontalListSortingStrategy}>
          {projectLanes.map(lane => (
            <Column
              key={lane.id}
              id={lane.id}
              title={lane.title}
              ticketIds={lane.ticketIds}
              tickets={tickets}
              filteredIds={filteredIds}
              onAddTicket={handleAddTicket}
            />
          ))}
        </SortableContext>

        {/* Add column button */}
        <button
          onClick={handleAddLane}
          className="w-[300px] flex-shrink-0 h-fit flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-400 dark:text-gray-600 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add column
        </button>
      </div>

      {/* Drag overlays */}
      <DragOverlay>
        {activeTicket && (
          <Card ticket={activeTicket} laneId="" isDragOverlay />
        )}
        {activeColumnId && !activeTicket && (
          <div className="w-[300px] h-[200px] rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-modal opacity-90" />
        )}
      </DragOverlay>
    </DndContext>
  );
};
