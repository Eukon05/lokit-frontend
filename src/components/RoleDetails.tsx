import { useState, useEffect } from "react";
import { deleteRole, disableRole, enableRole, getRole } from "../service/RoleService";
import type { RoleDetailsProps } from "../types/props/RoleDetailsProps";
import type { RoleResponse } from "../types/responses/role/RoleResponse";
import useAuthSession from "../hooks/useAuthSession";
import { useNavigate } from "react-router";

function RoleDetails({ roleId }: RoleDetailsProps) {
    const auth = useAuthSession();
    const navigate = useNavigate();
    const [roleDetails, setRoleDetails] = useState<RoleResponse>();

    async function _handleEnable() {
        try {
            await enableRole(roleId, auth.connectedUser.accessToken);
            setRoleDetails((previous) => previous ? { ...previous, active: true } : previous);
        }
        catch (error) {
            console.error("Failed to enable role " + roleId, error);
        }
    }

    async function _handleDisable() {
        try {
            await disableRole(roleId, auth.connectedUser.accessToken);
            setRoleDetails((previous) => previous ? { ...previous, active: false } : previous);
        }
        catch (error) {
            console.error("Failed to disable role " + roleId, error);
        }
    }

    async function _handleDelete() {
        try {
            await deleteRole(roleId, auth.connectedUser.accessToken);
            navigate("/roles", { replace: true, state: { refreshRoles: Date.now() } });
        }
        catch (error) {
            console.error("Failed to delete role " + roleId, error);
        }
    }

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
                            <button className="button is-warning mr-1" onClick={roleDetails.active ? _handleDisable : _handleEnable}>{roleDetails.active ? "Disable" : "Enable"}</button>
                            <button className="button is-danger" onClick={_handleDelete}>Delete</button>
                        </div>
                    </div>
                    <p>{roleDetails.description}</p>
                </div>
                <br />
                <p>Created at: {new Date(roleDetails.createdAt).toUTCString()}</p>
                <p>Updated at: {new Date(roleDetails.updatedAt).toUTCString()}</p>
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
