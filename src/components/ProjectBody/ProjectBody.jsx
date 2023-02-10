import { DragDropContext } from 'react-beautiful-dnd';
import { useStateValue } from '../../state/AppDataProvider';
import { ProjectBoard } from '../ProjectBoard/ProjectBoard';
import './ProjectBody.css';

export const ProjectBody = () => {
    const [{ }, dispatcher] = useStateValue();

    const onDragEnd = result => {
        console.log(result)
    }

    return <section className="project-body">
        <div className="project-body__search">Search</div>
        <DragDropContext onDragEnd={onDragEnd} >
            <ProjectBoard />
        </DragDropContext>
    </section>
}