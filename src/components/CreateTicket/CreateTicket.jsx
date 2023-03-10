import './CreateTicket.css';
import { Button, DatePicker, Form, Input, Radio, Space, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TextArea from 'antd/es/input/TextArea';
import { useStateValue } from '../../state/AppDataProvider';
import { Actions } from '../../state/actions';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getRandomImage } from '../../services/UnsplashApiService';

export const CreateTicket = () => {
    const [photo, setPhoto] = useState(null);
    const [{ saveTicket, projectLanes }, dispatcher] = useStateValue();
    const { laneId, ticket } = saveTicket;

    const getLaneName = () => {
        const lane = projectLanes.find(l => l.id == laneId);
        if (lane == undefined) return;
        const { title } = lane;
        return title;
    }

    const loadRandomImage = async () => {
        getRandomImage().then(img => {
            setPhoto(img);
        });
    }

    useEffect(() => {
        if (ticket != null) {
            setPhoto(saveTicket.ticket.photo)
            return;
        }
        loadRandomImage();
    }, [])

    return <section className="create-ticket">
        <div className="create-ticket__image-picker">
            <img src={photo} alt="" className={`create-ticket__image ${photo == null ? 'create-ticket__image--placeholder' : ''}`} />
            <Tooltip title='Powered by UnSplash'>
                <button onClick={loadRandomImage} className='create-ticket__random-image-button' >Random Image</button>
            </Tooltip>
        </div>
        <div className="create-ticket__form">
            <h1 className='create-ticket__title'>Create Ticket - {getLaneName()}</h1>
            <CreateTicketForm laneId={laneId} image={photo} />
        </div>
    </section>
}

const CreateTicketForm = ({ laneId, image }) => {
    const randomBetween = (min, max) => (max - min) * Math.random() + min;
    const randomList = () => {

        return [
            {
                name: 'Brad',
                photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
            },
            {
                name: 'Owen',
                photo: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3000&q=80',
            },
            {
                name: 'Jason',
                photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2080&q=80',
            },];
    };

    const [form] = Form.useForm();
    const [{ saveTicket }, dispatcher] = useStateValue();
    const { ticket } = saveTicket;
    const [state, setState] = useState({
        id: uuidv4(),
        tags: [
            'Bug',
            'Design'
        ],
        title: null,
        description: null,
        priority: 'Low',
        members: randomList(),
        photo: image,
        date: null,
    });

    useEffect(() => {
        if (ticket != null) {
            const test = { ...state, ...ticket };
            setState({ ...state, ...ticket, photo: image })
            form.resetFields();
            return;
        }
        setState({ ...state, photo: image })
    }, [image])



    const onValuesChanged = (result) => {
        setState({
            ...state,
            ...result
        })
        console.log(state);
    };

    const onSubmit = (values) => {
        dispatcher({
            type: Actions.ADD_TICKET,
            payload: {
                ticket: state,
                laneId: laneId,
            },
        })
    }

    const onCancel = () => {
        dispatcher({
            type: Actions.HIDE_SAVE_TICKET,
        })
    }

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={state}
            onValuesChange={onValuesChanged}
            onFinish={onSubmit}
        // onFinishFailed={(err) => alert(`There was a problem ${err}`)}
        >
            <Form.Item
                label="Title"
                required
                name="title"
                rules={[{
                    required: true,
                    message: 'Please enter a title.'
                }]} >
                <Input size='large' />
            </Form.Item>
            <Form.Item
                label="Description"
                required
                name="description"
                rules={[{
                    required: true,
                    message: 'Please enter a description.'
                }]}
            >
                <TextArea rows={4} draggable={false} />
            </Form.Item>
            <Form.Item label="Priority" name="priority">
                <Radio.Group>
                    <Radio.Button value="Low">Low</Radio.Button>
                    <Radio.Button value="Medium" >Medium</Radio.Button>
                    <Radio.Button value="High">High</Radio.Button>
                </Radio.Group>
            </Form.Item>
            {/* <Form.Item label="Date" name='date'>
                <DatePicker size='large' />
            </Form.Item> */}
            {/* TODO: Tags */}
            {/* <Form.Item label="Tags" >
                <Form.List name="users" initialValue={state.tags}>
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, index, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: '2px' }} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        name={[index, 'tag']}
                                        rules={[{ required: true, message: 'Missing first name' }]}
                                    >
                                        <Input placeholder={'Tag'} />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => {remove(index); setState({...state, tags: [].un })}} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add field
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form.Item> */}
            <Form.Item>
                <Button style={{ marginRight: '8px' }} type="primary" htmlType='submit'>Submit</Button>
                <Button htmlType="button" onClick={onCancel}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    );
}