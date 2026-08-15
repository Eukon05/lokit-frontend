import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import { getIdPAllUsers } from "../service/UserService";
import useAuthSession from "../hooks/useAuthSession";
import SearchableList from "../components/SearchableList";
import type { UserResponse } from "../types/responses/user/UserResponse";
import UserDetails from "../components/UserDetails";

function Users() {
    const auth = useAuthSession();
    const { userId } = useParams();
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
            <div className={"panel-block"} key={user.id}>
                <NavLink to={"/users/" + user.id}>{user.firstName} {user.lastName}</NavLink>
            </div>
        ));

    const userView = userId ? <UserDetails userId={userId} /> : (
        <div className="block">
            <p className="title has-text-centered">Select a user to view details</p>
        </div>
    )

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
                {userView}
            </div>
        </div>
    )
}

export default Users;