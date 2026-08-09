import { useAuthSession } from "../contexts/AuthSessionContext";

function Home() {
    const auth = useAuthSession();

    return (
        <div>
            Hello {auth.connectedUser.firstName + " " + auth.connectedUser.lastName}
            <br></br>
            Your email is: {auth.connectedUser.email} in the backend
            <br></br>
            You are {auth.connectedUser.roles.includes("LOKIT_ADMIN") ? "" : "NOT"} an admin
            <button onClick={() => void auth.logout()}>Log out</button>
        </div>
    )
}

export default Home;