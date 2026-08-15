import { useState, useEffect } from "react";
import { getUser } from "../service/UserService";
import type { UserDetailsProps } from "../types/props/UserDetailsProps";
import type { UserResponse } from "../types/responses/user/UserResponse";
import useAuthSession from "../hooks/useAuthSession";

function UserDetails({ userId }: UserDetailsProps) {
    const auth = useAuthSession();
    const [userDetails, setUserDetails] = useState<UserResponse>();
    //const [userRoles, setUserRoles] = useState<UserRolesResponse>();
    //const [userCards, setUserCards] = useState<UserCardsResponse>();

    useEffect(() => {
        let isActive = true;

        async function loadUser() {
            try {
                const idpUser = await getUser(userId, auth.connectedUser.accessToken);

                if (isActive) {
                    setUserDetails(idpUser);
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

    const render = userDetails ? (
        <div className="card">
            <div className="card-content">
                <div className="media-content">
                    <p className="title is-4">{userDetails?.firstName + " " + userDetails?.lastName}</p>
                    <p className="subtitle is-6">{userDetails?.email}</p>
                </div>
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