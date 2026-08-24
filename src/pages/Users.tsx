import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router";
import { getIdPAllUsers, syncIdpUsers } from "../service/UserService";
import useAuthSession from "../hooks/useAuthSession";
import SearchableList from "../components/common/SearchableList";
import type { UserResponse } from "../types/responses/user/UserResponse";
import UserDetails from "../components/user/UserDetails";
import ConfirmationModal from "../components/common/ConfirmationModal";
import toast from "react-hot-toast";

function Users() {
    const auth = useAuthSession();
    const location = useLocation();
    const navigate = useNavigate();
    const { userId } = useParams();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [query, setQuery] = useState<string>("");
    const [syncing, setSyncing] = useState<boolean>(false);
    const [showSyncModal, setShowSyncModal] = useState<boolean>(false);

    async function _handleSync() {
        setShowSyncModal(false);
        setSyncing(true);
        try {
            await syncIdpUsers(auth.connectedUser.accessToken);
            toast.success("Synced the users from IdP!")
            navigate('.', { replace: true, state: { refreshUsers: Date.now() } });
        } catch (error) {
            console.error("Failed to sync users", error);
        } finally {
            setSyncing(false);
        }
    }

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
    }, [auth.connectedUser.accessToken, location.state?.refreshUsers])

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
                    button={{
                        text: "Sync",
                        bulmaStyle: "is-warning",
                        onClick: () => setShowSyncModal(true),
                        disabled: syncing,
                        loading: syncing
                    }}
                >
                    {userBlocks}
                </SearchableList>
            </div>
            <div className="column">
                {userView}
            </div>
            <div>
                {showSyncModal && <ConfirmationModal text="Are you sure?" subtext="This action will sync all users from the IdP to Lokit's internal database. It may take a long time!" onConfirm={_handleSync} onCancel={() => setShowSyncModal(false)}/>}
            </div>
        </div>
    )
}

export default Users;