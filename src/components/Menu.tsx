import { NavLink } from "react-router";

function Menu(){
    return (
        <div className="menu column is-2 box">
            <p className="menu-label">Select dashboard</p>
            <ul className="menu-list">
                <li><NavLink to="/users">Users and IdP</NavLink></li>
                <li><NavLink to="/roles">Roles</NavLink></li>
                <li><a>Rooms</a></li>
                <li><a>Cards</a></li>
                <li><a>Card readers (devices)</a></li>
            </ul>
        </div>
    )
}

export default Menu;