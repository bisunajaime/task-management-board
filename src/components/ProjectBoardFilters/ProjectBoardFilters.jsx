import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import Search from 'antd/es/input/Search';
import { useState } from 'react';
import { Actions } from '../../state/actions';
import { useStateValue } from '../../state/AppDataProvider';
import './ProjectBoardFilters.css';

export const ProjectBoardFilters = () => {
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

    return <section className="project-filters">
        <Input
            size="large"
            onChange={onSearch}
            placeholder="Search tickets"
            prefix={<SearchOutlined style={{ marginRight: '8px' }} />}
            style={{
                maxWidth: '500px'
            }}
        />

    </section>
}