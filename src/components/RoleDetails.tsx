import { useState, useEffect } from "react";
import { getRole } from "../service/RoleService";
import type { RoleDetailsProps } from "../types/props/RoleDetailsProps";
import type { RoleResponse } from "../types/responses/role/RoleResponse";
import useAuthSession from "../hooks/useAuthSession";

function RoleDetails({ roleId }: RoleDetailsProps) {
    const auth = useAuthSession();
    const [roleDetails, setRoleDetails] = useState<RoleResponse>();

    useEffect(() => {
        let isActive = true;

        async function loadRole() {
            try {
                const role = await getRole(roleId, auth.connectedUser.accessToken);

                if (isActive) {
                    setRoleDetails(role);
                }
            } catch (error) {
                console.error("Failed to load role " + roleId, error);
            }
        }

        void loadRole();

        return () => {
            isActive = false;
        };
    }, [roleId])

    const tagStyle = "tag" + (roleDetails?.active ? " is-success" : " is-danger");

    const render = roleDetails ? (
        <div className="card">
            <div className="card-content">
                <div className="media-content">
                    <div className="is-flex is-flex-wrap-wrap is-flex-direction-row is-justify-content-space-between">
                        <div>
                            <span className="mr-3 title is-4">{roleDetails.name}</span>
                            <span className={tagStyle}>{roleDetails.active ? "Active" : "Disabled"}</span>
                        </div>
                        <div style={{ float: "right" }}>
                            <button className="button is-warning mr-1">Disable</button>
                            <button className="button is-danger">Delete</button>
                        </div>
                    </div>
                    <p>{roleDetails.description}</p>
                </div>
            </div>
        </div>
    ) :
        (
            <div>
                <p className="title has-text-centered">Role not found</p>
            </div>
        )

    return render;
}

export default RoleDetails;
