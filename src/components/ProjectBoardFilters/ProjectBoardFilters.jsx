import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Select } from 'antd';
import Search from 'antd/es/input/Search';
import { useState } from 'react';
import { Actions } from '../../state/actions';
import { useStateValue } from '../../state/AppDataProvider';
import './ProjectBoardFilters.css';

export const ProjectBoardFilters = () => {
    return <section className="project-filters">
        <ProjectBoardSearch />
        <ProjectBoardPriorityFilter />
    </section>
}

const ProjectBoardSearch = () => {
    const [{ }, dispatcher] = useStateValue();

    const onSearch = result => {
        const value = result.target.value;
        dispatcher({
            type: Actions.SEARCH_TICKETS,
            payload: {
                text: value
            },
        })
    }

    return <div className="project-filters__search">
        <h4 className='project-filters__search-label'>Search</h4>
        <Input
            size="large"
            onChange={onSearch}
            placeholder="Find a ticket or description"
            prefix={<SearchOutlined style={{ marginRight: '8px' }} />}
        />
    </div>
}

const ProjectBoardPriorityFilter = () => {
    const [{ }, dispatcher] = useStateValue();
    const [form] = Form.useForm();
    const priorities = ['All', 'Low', 'Medium', 'High'];


    const onValuesChange = val => {
        const { priority } = val;
        dispatcher({
            type: Actions.FILTER_PRIORITY,
            payload: {
                priority: priority,
            }
        });
    }

    return <div className="project-filters__filters">
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                priority: 'All',
            }}
            style={{ minWidth: 200 }}
            onValuesChange={onValuesChange}
        >
            <Form.Item label="Priority" name={'priority'} >
                <Select size='large'>
                    {priorities.map(p => <Select.Option key={p} value={p}>{p}</Select.Option>)}
                </Select>
            </Form.Item>
        </Form>
    </div>
}