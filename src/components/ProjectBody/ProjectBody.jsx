import { ProjectBoard } from '../ProjectBoard/ProjectBoard';
import './ProjectBody.css';

export const ProjectBody = () => {
    return <section className="project-body">
        <div className="project-body__search">Search</div>
        <ProjectBoard />
    </section>
}