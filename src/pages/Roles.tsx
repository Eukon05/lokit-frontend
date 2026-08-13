import { useEffect, useState } from "react";
import { getAllRoles } from "../service/RoleService";
import useAuthSession from "../hooks/useAuthSession";
import SearchableList from "../components/SearchableList";
import type { RoleResponse } from "../types/responses/RoleResponse";

function Users() {
    const auth = useAuthSession();
    const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [query, setQuery] = useState<string>("");

    useEffect(() => {
        let isActive = true;

        async function loadRoles() {
            try {
                const allRoles = await getAllRoles(auth.connectedUser.accessToken);

                if (isActive) {
                    setRoles(allRoles);
                }
            } catch (error) {
                console.error("Failed to load roles", error);
            }
        }

        void loadRoles();

        return () => {
            isActive = false;
        };
    }, [auth.connectedUser.accessToken])

    const roleBlocks = roles.filter(role => role.name.toLowerCase().includes(query.toLowerCase()) || role.description.toLowerCase().includes(query.toLowerCase()))
        .sort((o, t) => o.name.localeCompare(t.name))
        .map(role => (
            <div className="panel-block" key={role.id}>
                <a>{role.name}</a>
            </div>
        ));

    return (
        <div className="columns">
            <div className="column is-4">
                <SearchableList
                    title="Role list"
                    query={query}
                    onQueryChange={setQuery}
                    emptyText="No matching roles found"
                >
                    {roleBlocks}
                </SearchableList>
            </div>
            <div className="column">
                <div className="block">
                    <p className="title">Some role view</p>
                </div>
            </div>
        </div>
    )
}

export default Users;