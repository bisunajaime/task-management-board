import { ProjectLane } from '../ProjectLane/ProjectLane';
import './ProjectBoard.css';

export const ProjectBoard = () => {
    const totalLanes = 4;

    return <section className="project-board" style={{
        gridTemplateColumns: `repeat(${totalLanes}, 1fr)`
    }}>
        <ProjectLane />
        <ProjectLane />
        <ProjectLane />
        <ProjectLane />
    </section>
}