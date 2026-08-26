import { useState, useEffect } from "react";
import { assignUserRole, getUser, getUserRoles } from "../../service/UserService";
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

function UserDetails({ userId }: UserDetailsProps) {
    const auth = useAuthSession();
    const [userDetails, setUserDetails] = useState<UserResponse>();
    const [userRoles, setUserRoles] = useState<RoleResponse[]>();
    const [userCards, setUserCards] = useState<CardResponse[]>();
    const [showRoleAssignModal, setShowRoleAssignModal] = useState<boolean>(false);

    async function handleAssignRole(roleId: string) {
        setShowRoleAssignModal(false);
        try {
            await assignUserRole(userId, roleId, auth.connectedUser.accessToken);
            toast.success("Role assigned!");
        }
        catch (error) {
            console.error("Failed to assign role " + roleId, error);
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
    }, [userId])

    const roleBlocks = userRoles && userRoles.length > 0 ? userRoles.map((role) => (
        <button key={role.id} className="button is-small is-outlined is-link is-rounded">
            <NavLink to={"/roles/" + role.id}>{role.name}</NavLink>
        </button>
    )) : (<p className="subtitle is-7"> The user does not have any roles assigned</p>);

    const cardBlocks = userCards && userCards.length > 0 ? userCards.map((card) => (
        <button key={card.id} className="button is-small is-outlined is-link is-rounded">
            <NavLink to={"/cards/" + card.id}>{card.name}</NavLink>
        </button>
    )) : (<p className="subtitle is-7">The user does not have any roles assigned</p>);

    const render = userDetails ? (
        <div className="card">
            <div className="card-content">
                <div className="media-content">
                    <div className="is-flex is-flex-wrap-wrap is-flex-direction-row is-justify-content-space-between">
                        <div>
                            <p className="title is-4">{userDetails?.firstName + " " + userDetails?.lastName}</p>
                            <p className="subtitle is-6">{userDetails?.email}</p>
                        </div>
                        <div style={{ float: "right" }}>
                            <button className="button is-warning mr-1" onClick={() => setShowRoleAssignModal(true)}>Assign role</button>
                        </div>
                    </div>
                </div>
                <br />
                <div>
                    <p className="title is-6">Roles</p>
                    {roleBlocks}
                </div>
                <br />
                <div>
                    <p className="title is-6">Cards</p>
                    {cardBlocks}
                </div>
            </div>
            <div>
                {showRoleAssignModal && <AssignRoleModal excludeRoles={userRoles} onConfirm={handleAssignRole} onCancel={() => setShowRoleAssignModal(false)} />}
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