import useAuthSession from "../hooks/useAuthSession";

function Home() {
    const auth = useAuthSession();

    return (
        <div className="hero">
            <div className="hero-body has-text-centered">
                <p className="title">Hello {auth.connectedUser.firstName} {auth.connectedUser.lastName}!</p>
                <p className="subtitle">Please use the menu to navigate to the appropriate dashboard</p>
            </div>
        </div>
    )
}

export default Home;