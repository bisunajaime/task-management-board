import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Actions } from '../../state/actions';
import { useStateValue } from '../../state/AppDataProvider';
import './ProjectLane.css';

export const ProjectLane = ({ id, label, items, innerRef }) => {
    const [{ tickets }] = useStateValue();

    return <div className="project-lane" ref={innerRef}>
        <ProjectLaneHeading label={label} itemCount={items.length} />
        <AddTicketButton lane={id} />
        {items.map(i => <ProjectLaneItem
            key={i}
            item={tickets[i]}
            lane={label}
            index={items.indexOf(i)}
        />)}
    </div>
}

const ProjectLaneHeading = ({ label, itemCount }) => {
    return <div className="project-lane-heading">
        <span className="project-lane-heading__label">{label}</span>
        <span className="project-lane-heading__itemCount">{itemCount}</span>
    </div>
}

const ProjectLaneItem = ({ item, lane, index }) => {
    const { id, tags, title, priority, members, photo } = item;
    const [{ selectedTicket, projectLanes }, dispatcher] = useStateValue();

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

    return <Draggable key={id} draggableId={id} index={index} >
        {(provided, snapshot) => (<div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="project-lane-item" onClick={() => selectTicket()} >
            <div className="project-lane-item__row">
                <div className="project-lane-item__tags">
                    {tags.map(t => <span key={t} className='project-lane-item__tag'>{t}</span>)}
                </div>
                <span className="project-lane-item__priority" style={{ color: colorFromPriority(priority) }}>{priority}</span>
            </div>
            <h1 className="project-lane-item__title">{title}</h1>
            <div className="project-lane-item__members">
                {members.map(m => <div key={m} className="project-lane-item__member" />)}
            </div>
        </div>)}
    </Draggable>
}

const AddTicketButton = ({ lane }) => {
    const [{ }, dispatcher] = useStateValue();

    const onCreateTicketClick = () => {
        dispatcher({
            type: Actions.UNSELECT_TICKET,
        })
        dispatcher({
            type: Actions.SHOW_ADD_TICKET,
            payload: lane
        })
    }

    return <div className="project-lane-add_ticket" onClick={onCreateTicketClick} >
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