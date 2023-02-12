import { Form, Select, Tooltip } from 'antd';
import { Actions } from '../../state/actions';
import { useStateValue } from '../../state/AppDataProvider';
import { colorFromPriority } from '../ProjectLane/ProjectLane';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';
import './TicketDetails.css';
import { useEffect } from 'react';

export const TicketDetails = () => {
    const [{ projectLanes, selectedTicket }, dispatcher] = useStateValue();
    const { id, lane, tags, title, priority, description, members, photo } = selectedTicket;

    const getLaneTitle = () => {
        const laneDetails = projectLanes.find(l => l.id == lane)
        if (laneDetails == undefined) return;
        return laneDetails.title
    }

    const showEditTicket = () => {
        dispatcher({
            type: Actions.SHOW_SAVE_TICKET,
            payload: {
                ticket: selectedTicket,
                laneId: lane,
            }
        })
    }

    const closeTicket = () => {
        dispatcher({
            type: Actions.UNSELECT_TICKET
        })
    }

    return <section className="ticket-details">
        <img className='ticket-details__cover-image' src={photo} alt="ticket image" />
        <div className="ticket-details__content">
            <div className="ticket-details__heading">
                <div className="ticket-details__priority" style={{
                    backgroundColor: colorFromPriority(priority)
                }}>{priority} - {getLaneTitle()}</div>
                <div className="ticket-details__heading-button-group">
                    <Tooltip title="Edit ticket">
                        <EditOutlined onClick={showEditTicket} className='ticket-details__button-edit' />
                    </Tooltip>
                    <Tooltip title="Close ticket">
                        <CloseOutlined onClick={closeTicket} className='ticket-details__button-close' />
                    </Tooltip>
                </div>
            </div>
            <div className="ticket-details__code">{id}</div>
            <div className="ticket-details__title">{title}</div>
            <div className="ticket-details__tags">
                {tags?.map(t => <div key={t} className="ticket-details__tags-tag">{t}</div>)}
            </div>
            <div className="ticket-details__description">
                {description}
            </div>
            <MoveTicketLane key={id} details={selectedTicket} />
            <UpdateTicketPriority details={selectedTicket} />
            <div className="ticket-details__comments"></div>
        </div>
    </section >
}

const MoveTicketLane = ({ details }) => {
    const [{ selectedTicket, projectLanes }, dispatcher] = useStateValue();
    const [form] = Form.useForm();

    const onValuesChange = val => {
        dispatcher({
            type: Actions.MOVE_TICKET,
            payload: {
                prevLane: details.lane,
                newLane: val.lane,
                ticketId: details.id
            },
        })
    }

    return <div className="move-ticket-lane">
        <Form
            form={form}
            wrapperCol={{ span: 14 }}
            initialValues={{
                lane: details.lane
            }}
            layout="horizontal"
            onValuesChange={onValuesChange}
            style={{ maxWidth: 600 }}
        >

            <Form.Item label="Status" name={'lane'} >
                <Select size='large'>
                    {projectLanes.map(lane => <Select.Option key={lane.id} value={lane.id}>{lane.title}</Select.Option>)}
                </Select>
            </Form.Item>
        </Form>
    </div>
}

const UpdateTicketPriority = ({ details }) => {
    const [{ }, dispatcher] = useStateValue();
    const [form] = Form.useForm();
    const priorities = ['Low', 'Medium', 'High'];

    useEffect(() => {
        form.resetFields()
    }, [details.priority]);

    const onValuesChange = val => {
        dispatcher({
            type: Actions.UPDATE_TICKET_PRIORITY,
            payload: {
                ticketId: details.id,
                priority: val.priority
            },
        })
    }

    return <div className="move-ticket-lane">
        <Form
            form={form}
            wrapperCol={{ span: 14 }}
            initialValues={{
                priority: details.priority
            }}
            layout="horizontal"
            onValuesChange={onValuesChange}
            style={{ maxWidth: 600 }}
        >
            <Form.Item label="Priority" name={'priority'} >
                <Select size='large'>
                    {priorities.map(p => <Select.Option key={p} value={p}>{p}</Select.Option>)}
                </Select>
            </Form.Item>
        </Form>
    </div>
}