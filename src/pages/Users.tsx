import { useEffect, useState } from "react";
import { getIdPAllUsers } from "../service/UserService";
import useAuthSession from "../hooks/useAuthSession";
import type { UserResponse } from "../types/responses/UserResponse";

function Users() {
    const auth = useAuthSession();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [query, setQuery] = useState<string>("");

    useEffect(() => {
        let isActive = true;

        async function loadUsers() {
            try {
                const idpUsers = await getIdPAllUsers(auth.connectedUser.accessToken);

                if (isActive) {
                    setUsers(idpUsers);
                }
            } catch (error) {
                console.error("Failed to load users", error);
            }
        }

        void loadUsers();

        return () => {
            isActive = false;
        };
    }, [auth.connectedUser.accessToken])

    const userBlocks = users.length === 0 ? (
        <div className="panel-block">
            <span>No users loaded yet</span>
        </div>
    ) : (
        users.filter(user => user.firstName.toLowerCase().includes(query.toLowerCase()) || user.lastName.toLowerCase().includes(query.toLowerCase()))
        .map(user => (
            <div className="panel-block" key={user.id}>
                <a>{user.firstName} {user.lastName}</a>
            </div>
        ))
    );

    return (
        <div className="columns">
            <div className="column is-4">
                <div className="panel is-primary">
                    <p className="panel-heading">User list</p>
                    <div className="panel-block">
                        <input className="input" type="text" onChange={e => setQuery(e.target.value)} placeholder="Search for users..." />
                    </div>
                    <div>
                        {userBlocks}
                    </div>
                </div>
            </div>
            <div className="column">
                <div className="block">
                    <p className="title">Some user view</p>
                </div>
            </div>
        </div>
    )
}

export default Users;