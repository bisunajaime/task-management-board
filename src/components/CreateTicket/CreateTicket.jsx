import './CreateTicket.css';
import { Button, DatePicker, Form, Input, Radio, Space } from 'antd';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TextArea from 'antd/es/input/TextArea';
import { useStateValue } from '../../state/AppDataProvider';
import { Actions } from '../../state/actions';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export const CreateTicket = ({
    laneId,
}) => {
    const [{ addTicket, projectLanes }, dispatcher] = useStateValue();

    const getLaneName = () => {
        const { laneId } = addTicket;
        const lane = projectLanes.find(l => l.id == laneId);
        if (lane == undefined) return;
        const { title } = lane;
        return title;
    }
    return <section className="create-ticket">
        <h1 className='create-ticket__title'>Create Ticket - {getLaneName()}</h1>
        <CreateTicketForm laneId={laneId} />
    </section>
}

const CreateTicketForm = ({ laneId }) => {
    const [form] = Form.useForm();
    const [{ }, dispatcher] = useStateValue();
    const [state, setState] = useState({
        id: uuidv4(),
        tags: [
            'Bug',
            'Design'
        ],
        title: null,
        description: null,
        priority: 'Low',
        members: [1],
        photo: null,
        date: null,
    });
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
        dispatcher({
            type: Actions.HIDE_ADD_TICKET,
        })
    }

    const onCancel = () => {
        dispatcher({
            type: Actions.HIDE_ADD_TICKET,
        })
    }


    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
        },
    };

    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 },
        },
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={state}
            onValuesChange={onValuesChanged}
            onFinish={onSubmit}
            onFinishFailed={(err) => alert(`There was a problem ${err}`)}
        >
            <Form.Item label="Title" required name="title" >
                <Input size='large' placeholder="input placeholder" />
            </Form.Item>
            <Form.Item label="Description" required name="description">
                <TextArea rows={4} draggable={false} />
            </Form.Item>
            <Form.Item label="Priority" name="priority" initialValue={state.priority}>
                <Radio.Group>
                    <Radio.Button value="Low">Low</Radio.Button>
                    <Radio.Button value="Medium" >Medium</Radio.Button>
                    <Radio.Button value="High">High</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="Date" name='date'>
                <DatePicker size='large' />
            </Form.Item>
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