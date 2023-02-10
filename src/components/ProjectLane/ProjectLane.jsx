import { useState } from 'react';
import { Actions } from '../../state/actions';
import { useStateValue } from '../../state/AppDataProvider';
import './ProjectLane.css';

export const ProjectLane = ({ label, items }) => {

    return <div className="project-lane">
        <ProjectLaneHeading label={label} itemCount={items.length} />
        <AddTicketButton lane={label} />
        {items.map(i => <ProjectLaneItem item={i} lane={label} />)}
    </div>
}

const ProjectLaneHeading = ({ label, itemCount }) => {
    return <div className="project-lane-heading">
        <span className="project-lane-heading__label">{label}</span>
        <span className="project-lane-heading__itemCount">{itemCount}</span>
    </div>
}

const ProjectLaneItem = ({ item, lane }) => {
    const { id, tags, title, priority, members, photo } = item;
    const [{ selectedTicket }, dispatcher] = useStateValue();

    const selectTicket = () => {
        const sameTicket = selectedTicket?.id == id;
        dispatcher({
            type: Actions.SELECT_TICKET,
            payload: sameTicket ? null : {
                details: item,
                lane: lane,
            },
        })
    }

    return <div className="project-lane-item" onClick={() => selectTicket()} >
        <div className="project-lane-item__row">
            <div className="project-lane-item__tags">
                {tags.map(t => <span className='project-lane-item__tag'>{t}</span>)}
            </div>
            <span className="project-lane-item__priority" style={{ color: colorFromPriority(priority) }}>{priority}</span>
        </div>
        <h1 className="project-lane-item__title">{title}</h1>
        <div className="project-lane-item__members">
            {members.map(m => <div className="project-lane-item__member" />)}
        </div>
    </div>
}

const AddTicketButton = ({ lane }) => {
    const [{ }, dispatcher] = useStateValue();

    const onCreateTicketClick = () => {
        dispatcher({
            type: Actions.UNSELECT_TICKET,
        })
        dispatcher({
            type: Actions.SHOW_ADD_TICKET,
        })
    }

    return <div className="project-lane-add_ticket" onClick={() => onCreateTicketClick()} >
        Create Ticket
    </div>
}

export const colorFromPriority = priority => {
    switch (priority) {
        case 'Low': return '#33962c';
        case 'Medium': return '#ec822c';
        case 'High': return '#ff8686';
        default: return '#000000';
    }
}