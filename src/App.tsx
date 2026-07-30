import { useState } from 'react'
import useAuthSession from './hooks/AuthSessionHook';
import type { MeResponse } from './types/responses/MeResponse';
import type { AuthSession } from './types/AuthSession';
import './App.css'

function App() {
    const auth: AuthSession = useAuthSession();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.isAuthenticated) {
        // Request to save or update the logged-in user on the backend
        fetch("/api/v1/identity/me", { headers: { "Authorization": "Bearer " + auth.connectedUser.accessToken } })
            .then((rsp: Response) => rsp.json())
            .then((data: MeResponse) => {
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setEmail(data.email);
            });

        return (
            <div>
                Hello {firstName + " " + lastName}
                <br></br>
                Your email is: {email} in the backend
                <br></br>
                You are {auth.connectedUser.roles.includes("LOKIT_ADMIN") ? "" : "NOT"} an admin
                <button onClick={() => void auth.logout()}>Log out</button>
            </div>
        );
    }

    return <button onClick={() => void auth.login()}>Log in</button>;
}

export default App
