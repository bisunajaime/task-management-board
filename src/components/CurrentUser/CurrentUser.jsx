import './CurrentUser.css';

export const CurrentUser = () => {
    return <div className="currentuser">
        <div className="currentuser__photo"></div>
        <div className="currentuser__credentials">
            <div className="currentuser__name">
                Darrel Steward
            </div>
            <div className="currentuser__role">
                UI Designer
            </div>
        </div>
    </div>
}