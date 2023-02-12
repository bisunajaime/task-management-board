import { BellOutlined, HomeOutlined, OrderedListOutlined, TeamOutlined } from '@ant-design/icons'
import { CurrentUser } from '../CurrentUser/CurrentUser'
import { NavigationItem } from '../NavigationItem/NavigationItem'
import './Navigation.css'

export const Navigation = () => {
    return <section className="navigation">
        <CurrentUser />
        <Divider />
        <NavigationItems />
        <Divider />
    </section>
}

const Divider = () => {
    return <hr className='navigation__divider' />
}

const NavigationItems = () => {
    return <div className="navigation__items">
        <NavigationItem icon={<HomeOutlined />} label={'Dashboard'} />
        {/* <NavigationItem icon={<OrderedListOutlined />} label={'My Tasks'} /> */}
        {/* <NavigationItem  label={'Document'} />
        <NavigationItem label={'Progress'} /> */}
        {/* <NavigationItem icon={<BellOutlined />} label={'Notification'} />
        <NavigationItem icon={<TeamOutlined />} label={'Members'} /> */}
    </div>
}