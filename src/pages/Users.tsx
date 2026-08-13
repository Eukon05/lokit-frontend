import { useEffect, useState } from "react";
import { getIdPAllUsers } from "../service/UserService";
import useAuthSession from "../hooks/useAuthSession";
import SearchableList from "../components/SearchableList";
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

    const userBlocks = users.filter(user => user.firstName.toLowerCase().includes(query.toLowerCase()) || user.lastName.toLowerCase().includes(query.toLowerCase()))
        .sort((o, t) => o.firstName.localeCompare(t.firstName))
        .map(user => (
            <div className="panel-block" key={user.id}>
                <a>{user.firstName} {user.lastName}</a>
            </div>
        ));

    return (
        <div className="columns">
            <div className="column is-4">
                <SearchableList
                    title="User list"
                    query={query}
                    onQueryChange={setQuery}
                    emptyText="No matching users found"
                >
                    {userBlocks}
                </SearchableList>
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