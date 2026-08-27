import { useState, useEffect } from "react";
import { assignUserRole, getUser, getUserRoles, removeUserRole } from "../../service/UserService";
import type { UserDetailsProps } from "../../types/props/UserDetailsProps";
import type { UserResponse } from "../../types/responses/user/UserResponse";
import useAuthSession from "../../hooks/useAuthSession";
import type { RoleResponse } from "../../types/responses/role/RoleResponse";
import type { CardResponse } from "../../types/responses/card/CardResponse";
import { lookupRoles } from "../../service/RoleService";
import { getUserCards, lookupCards } from "../../service/CardService";
import { NavLink } from "react-router";
import toast from "react-hot-toast";
import AssignRoleModal from "../common/AssignRoleModal";
import ConfirmationModal from "../common/ConfirmationModal";

function UserDetails({ userId }: UserDetailsProps) {
    const auth = useAuthSession();
    const [userDetails, setUserDetails] = useState<UserResponse>();
    const [userRoles, setUserRoles] = useState<RoleResponse[]>();
    const [userCards, setUserCards] = useState<CardResponse[]>();
    const [showRoleAssignModal, setShowRoleAssignModal] = useState<boolean>(false);
    const [roleToRemove, setRoleToRemove] = useState<RoleResponse>();
    const [rolesRefreshKey, setRolesRefreshKey] = useState(0);

    async function handleAssignRole(roleId: string) {
        setShowRoleAssignModal(false);
        try {
            await assignUserRole(userId, roleId, auth.connectedUser.accessToken);
            setRolesRefreshKey((previous) => previous + 1);
            toast.success("Role assigned!");
        }
        catch (error) {
            console.error("Failed to assign role " + roleId, error);
        }
    }

    async function handleRemoveRole() {
        if (!roleToRemove) return;

        try {
            await removeUserRole(userId, roleToRemove.id, auth.connectedUser.accessToken);
            setRoleToRemove(undefined);
            setRolesRefreshKey((previous) => previous + 1);
            toast.success("Role removed!");
        }
        catch (error) {
            console.error("Failed to remove role " + roleToRemove.id, error);
        }
    }

    useEffect(() => {
        let isActive = true;

        async function loadUser() {
            try {
                const idpUser = await getUser(userId, auth.connectedUser.accessToken);
                const userRoleIds = await getUserRoles(userId, auth.connectedUser.accessToken);
                const userCardIds = await getUserCards(userId, auth.connectedUser.accessToken);

                const roleIds = userRoleIds?.roles ?? [];
                const cardIds = userCardIds?.cards ?? [];

                const fetchedCards = cardIds.length > 0
                    ? await lookupCards({ cardIds: cardIds }, auth.connectedUser.accessToken)
                    : [];
                const fetchedRoles = roleIds.length > 0
                    ? await lookupRoles({ roleIds: roleIds }, auth.connectedUser.accessToken)
                    : [];

                if (isActive) {
                    setUserDetails(idpUser);
                    setUserCards(fetchedCards);
                    setUserRoles(fetchedRoles);
                }
            } catch (error) {
                console.error("Failed to load user " + userId, error);
            }
        }

        void loadUser();

        return () => {
            isActive = false;
        };
    }, [userId, rolesRefreshKey])

    const roleBlocks = userRoles && userRoles.length > 0 ? (
        <div className="field is-grouped is-grouped-multiline">
            {userRoles.map((role) => (
                <div key={role.id} className="control">
                    <div className="tags has-addons">
                        <NavLink className="tag is-link" to={"/roles/" + role.id}>{role.name}</NavLink>
                        <button className="tag is-delete" aria-label={"Remove " + role.name} onClick={() => setRoleToRemove(role)}></button>
                    </div>
                </div>
            ))}
        </div>
    ) : (<p className="subtitle is-7"> The user does not have any roles assigned</p>);

    const cardBlocks = userCards && userCards.length > 0 ? (
        <div className="field is-grouped is-grouped-multiline">
            {userCards.map((card) => (
                <div key={card.id} className="control">
                    <NavLink className="tag is-link" to={"/cards/" + card.id}>{card.name}</NavLink>
                </div>
            ))}
        </div>
    ) : (<p className="subtitle is-7">The user does not have any roles assigned</p>);

    const render = userDetails ? (
        <div className="card">
            <div className="card-content">
                <div className="media-content">
                    <div className="is-flex is-flex-wrap-wrap is-flex-direction-row is-justify-content-space-between">
                        <div>
                            <p className="title is-4">{userDetails?.firstName + " " + userDetails?.lastName}</p>
                            <p className="subtitle is-6">{userDetails?.email}</p>
                        </div>
                    </div>
                </div>
                <br />
                <div>
                    <p className="title is-6">Roles</p>
                    {roleBlocks}
                    <button className="button is-small is-outlined is-primary is-rounded" onClick={() => setShowRoleAssignModal(true)}>+</button>
                </div>
                <br />
                <div>
                    <p className="title is-6">Cards</p>
                    {cardBlocks}
                </div>
            </div>
            <div>
                {showRoleAssignModal && <AssignRoleModal excludeRoles={userRoles} onConfirm={handleAssignRole} onCancel={() => setShowRoleAssignModal(false)} />}
                {roleToRemove && <ConfirmationModal text={"Remove " + roleToRemove.name + "?"} subtext="The role will no longer be assigned to this user." onConfirm={handleRemoveRole} onCancel={() => setRoleToRemove(undefined)} />}
            </div>
        </div>
    ) :
        (
            <div>
                <p className="title has-text-centered">User not found</p>
            </div>
        )

    return render;
}

export default UserDetails;