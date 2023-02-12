import { Actions } from '../../state/actions';
import { useStateValue } from '../../state/AppDataProvider';
import { ProjectLane } from '../ProjectLane/ProjectLane';
import './ProjectBoard.css';

export const ProjectBoard = () => {
    const [{ projectLanes }, dispatcher] = useStateValue();
    const totalLanes = projectLanes.length + 1;

    return <section
        className="project-board"
        style={{
            gridTemplateColumns: `repeat(${totalLanes}, 300px)`
        }}
    >
        {projectLanes.map(lane => <ProjectLane
            key={lane.id}
            id={lane.id}
            label={lane.title}
            items={lane.ticketIds}
        />)}
        <AddProjectLane />
    </section>
}

const AddProjectLane = () => {
    return <div className="project-lane">
        <AddProjectLaneHeading label={'Add Lane'} />
    </div>
}



const AddProjectLaneHeading = ({ label }) => {
    const [{ }, dispatcher] = useStateValue();

    const onAddClick = () => {
        const title = prompt('Enter a lane name:')
        if (title == null || title == '') return;
        dispatcher({
            type: Actions.ADD_LANE,
            payload: title,
        })
    }

    return <div className="project-lane-heading--add" onClick={onAddClick} >
        <span className="project-lane-heading__label--add">{label}</span>
    </div>
}