import './CurrentUser.css';

export const CurrentUser = () => {
    return <div className="currentuser">
        <div className="currentuser__photo"></div>
        <div className="currentuser__credentials">
            <div className="currentuser__name">
                John M. Doe
            </div>
            <div className="currentuser__role">
                Developer
            </div>
        </div>
    </div>
}