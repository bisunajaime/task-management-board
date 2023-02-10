import { colorFromPriority } from '../ProjectLane/ProjectLane';
import './TicketDetails.css';

export const TicketDetails = ({ details }) => {
    const { id, lane, tags, title, priority, description, members, photo } = details;
    return <section className="ticket-details">
        <img className='ticket-details__cover-image' src={'https://images.unsplash.com/photo-1475669698648-2f144fcaaeb1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'} alt="ticket image" />
        <div className="ticket-details__content">
            <div className="ticket-details__priority" style={{
                backgroundColor: colorFromPriority(priority)
            }}>{priority} - {lane}</div>
            <div className="ticket-details__code">{id}</div>
            <div className="ticket-details__title">{title}</div>
            <div className="ticket-details__tags">
                {tags?.map(t => <div className="ticket-details__tags-tag">{t}</div>)}
                <div className="ticket-details__tags-tag--add">Add a tag</div>
            </div>
            <div className="ticket-details__description">
                {description}
            </div>
            <div className="ticket-details__attachment-title">
                Attachments
            </div>
            <div className="ticket-details__attachments">
                <div className="attachment"></div>
                <div className="attachment"></div>
            </div>
            <div className="ticket-details__comments"></div>
        </div>
    </section >
}

const sampleTicketDetails = {
    imageUrl: 'https://images.unsplash.com/photo-1475669698648-2f144fcaaeb1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    code: 'UI-1',
    title: 'Design Dark Mode',
    tags: ['Theme', 'Design', 'Web Design', 'Mobile Design', 'Figma'],
    description: '',
    attachmentIds: [],
    commentIds: [],
}