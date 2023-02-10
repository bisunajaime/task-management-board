import { ProjectBody } from '../ProjectBody/ProjectBody';
import { ProjectHeading } from '../ProjectHeading/ProjectHeading';
import { TicketDetails } from '../TicketDetails/TicketDetails';
import './Body.css';

export const Body = () => {
    return <section className="body">
        <ProjectHeading />
        <BodyDivider />
        <ProjectBody />
    </section>
}


const BodyDivider = () => <hr className='body__divider' />