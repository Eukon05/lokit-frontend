import { NavLink } from "react-router";

const linkActiveSwitcher = ({ isActive }: { isActive: boolean }) => isActive ? "is-active" : "";

function Menu(){
    return (
        <div className="menu column is-2 box">
            <p className="menu-label">Select dashboard</p>
            <ul className="menu-list">
                <li><NavLink to="/users" className={linkActiveSwitcher}>Users and IdP</NavLink></li>
                <li><NavLink to="/roles" className={linkActiveSwitcher}>Roles</NavLink></li>
                <li><NavLink to="/rooms" className={linkActiveSwitcher}>Rooms</NavLink></li>
                <li><NavLink to="/cards" className={linkActiveSwitcher}>Cards</NavLink></li>
                <li><NavLink to="/devices" className={linkActiveSwitcher}>Devices (door card readers)</NavLink></li>
            </ul>
        </div>
    )
}

export default Menu;