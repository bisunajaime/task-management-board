import './ProjectLane.css';

export const ProjectLane = () => {

    const items = [{
        tags: ['Design', 'Bug', 'PDF', 'Hello'],
        title: 'Design Profile Bug',
        priority: 'Low',
        members: 3,
        photo: null
    }];

    return <div className="project-lane">
        <ProjectLaneHeading label={"To Do"} itemCount={"3"} />
        {items.map(i => <ProjectLaneItem item={i} />)}
    </div>
}

const ProjectLaneHeading = ({ label, itemCount }) => {
    return <div className="project-lane-heading">
        <span className="project-lane-heading__label">{label}</span>
        <span className="project-lane-heading__itemCount">{itemCount}</span>
    </div>
}

const ProjectLaneItem = ({ item }) => {
    const { tags, title, priority, members, photo } = item;
    return <div className="project-lane-item">
        <div className="project-lane-item__row">
            <div className="project-lane-item__tags">
                {tags.map(t => <span className='project-lane-item__tag'>{t}</span>)}
            </div>
            <span className="project-lane-item__priority" style={{ color: colorFromPriority(priority) }}>{priority}</span>
        </div>
        <h1 className="project-lane-item__title">{title}</h1>
    </div>
}

const colorFromPriority = priority => {
    switch (priority) {
        case 'Low': return '#33962c';
        case 'Medium': return '#ec822c';
        case 'High': return '#ff8686';
        default: return '#000000';
    }
}