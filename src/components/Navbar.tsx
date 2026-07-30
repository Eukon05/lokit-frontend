import useAuthSession from "../hooks/AuthSessionHook";
import "../style/navbar.css"

function Navbar() {
    const auth = useAuthSession();

    return (
        <div className="navbar">
            <h1>Lokit</h1>
            <div className="navbarAuth">
                <div className="navbarProfile">
                    <span>{auth.connectedUser.firstName + " " + auth.connectedUser.lastName}</span>
                    <span>{auth.connectedUser.email}</span>
                </div>
                <button onClick={auth.logout}>Logout</button>
            </div>
        </div>
    )
}

export default Navbar;