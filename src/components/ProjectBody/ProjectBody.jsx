import { ProjectBoard } from '../ProjectBoard/ProjectBoard';
import { ProjectBoardFilters } from '../ProjectBoardFilters/ProjectBoardFilters';
import './ProjectBody.css';

export const ProjectBody = () => {
    return <section className="project-body">
        <ProjectBoardFilters />
        <ProjectBoard />
    </section>
}