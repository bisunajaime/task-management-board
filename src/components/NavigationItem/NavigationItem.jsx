import './NavigationItem.css';

export const NavigationItem = ({ icon, label }) => {
    return <div className="navigation-item">
        <div className="navigation-item__icon">{icon}</div>
        <div className="navigation-item__label">{label}</div>
    </div>
}