import { Tooltip } from 'antd';
import { Actions } from '../../state/actions';
import { useStateValue } from '../../state/AppDataProvider';
import './ProjectLane.css';

export const ProjectLane = ({ id, label, items }) => {
    const [{ tickets, searchResults }] = useStateValue();
    const hasSearchResults = searchResults != null;

    return <div className="project-lane">
        <ProjectLaneHeading label={label} itemCount={items.length} />
        <AddTicketButton lane={id} />
        {items.map(i => {
            if (hasSearchResults) {
                const resultInLane = searchResults[i] != undefined;
                return resultInLane ? <ProjectLaneItem
                    key={i}
                    item={searchResults[i]}
                    lane={id}
                /> : <></>
            }
            return <ProjectLaneItem
                key={i}
                item={tickets[i]}
                lane={id}
            />
        })}
    </div>
}

const ProjectLaneHeading = ({ label, itemCount }) => {
    return <div className="project-lane-heading">
        <span className="project-lane-heading__label">{label}</span>
        <span className="project-lane-heading__itemCount">{itemCount}</span>
    </div>
}

const ProjectLaneItem = ({ item, lane }) => {
    const { id, tags, title, description, priority, members, photo } = item;
    const [{ selectedTicket, saveTicket }, dispatcher] = useStateValue();
    const isSelected = id == selectedTicket?.id || saveTicket?.ticket?.id == id;

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

    return <div className={`project-lane-item ${isSelected ? 'project-lane-item--selected' : ''}`} onClick={() => selectTicket()} >
        <div className="project-lane-item__row">
            <div className="project-lane-item__tags">
                {tags.map(t => <span key={t} className='project-lane-item__tag'>{t}</span>)}
            </div>
            <span className="project-lane-item__priority" style={{ color: colorFromPriority(priority) }}>{priority}</span>
        </div>
        <h1 className="project-lane-item__title">{title}</h1>
        <p className="project-lane-item__description">{description}</p>
        <div className="project-lane-item__members">
            {members.map(m => <div key={m} className="project-lane-item__member">
                <Tooltip title={m.name}>
                    <img src={m.photo} className='project-lane-item__member-photo' />
                </Tooltip>
            </div>)}
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
            type: Actions.SHOW_SAVE_TICKET,
            payload: {
                laneId: lane,
            }
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