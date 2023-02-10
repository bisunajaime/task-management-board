import { Droppable } from 'react-beautiful-dnd';
import { useStateValue } from '../../state/AppDataProvider';
import { ProjectLane } from '../ProjectLane/ProjectLane';
import './ProjectBoard.css';

export const ProjectBoard = () => {
    const [{ projectLanes }, dispatcher] = useStateValue();
    const totalLanes = projectLanes.length;

    return <section className="project-board" style={{
        gridTemplateColumns: `repeat(${totalLanes}, 300px)`
    }}>
        {projectLanes.map(lane => <Droppable droppableId='droppable' >
            {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}  >
                    <ProjectLane
                        key={lane.id}
                        id={lane.id}
                        label={lane.title}
                        items={lane.ticketIds}
                    />
                    {provided.placeholder}
                </div>
            )}
        </Droppable>)}
    </section>
}