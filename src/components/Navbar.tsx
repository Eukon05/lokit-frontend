import useAuthSession from "../hooks/useAuthSession.ts"

function Navbar() {
    const auth = useAuthSession();

    return (
        <div className="navbar is-fixed-top is-link">
            <div className="navbar-brand">
                <div className="navbar-item">
                    <h1 className="title">Lokit</h1>
                </div>
            </div>
            <div className="navbar-menu">
                <div className="navbar-end">
                    <div className="navbar-item">
                        <span>{auth.connectedUser.firstName + " " + auth.connectedUser.lastName}</span>
                        <span>{auth.connectedUser.email}</span>
                    </div>
                    <div className="navbar-item">
                        <button className="button is-danger" onClick={auth.logout}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar;