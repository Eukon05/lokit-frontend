import { useState, useEffect } from "react";

import useAuthSession from "../../hooks/useAuthSession";
import { NavLink, useNavigate } from "react-router";
import type { RoomDetailsProps } from "../../types/props/RoomDetailsProps";
import type { RoomResponse } from "../../types/responses/room/RoomResponse";
import { assignRoomRole, deleteRoom, disableRoom, enableRoom, getRoom, removeRoomRole } from "../../service/RoomService";
import type { RoleResponse } from "../../types/responses/role/RoleResponse";
import { lookupRoles } from "../../service/RoleService";
import ConfirmationModal from "../common/ConfirmationModal";
import AssignRoleModal from "../common/AssignRoleModal";
import toast from "react-hot-toast";

function RoomDetails({ roomId }: RoomDetailsProps) {
    const auth = useAuthSession();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [roomDetails, setRoomDetails] = useState<RoomResponse>();
    const [roomRoles, setRoomRoles] = useState<RoleResponse[]>();
    const [showRoleAssignModal, setShowRoleAssignModal] = useState<boolean>(false);
    const [roleToRemove, setRoleToRemove] = useState<RoleResponse>();
    const [rolesRefreshKey, setRolesRefreshKey] = useState(0);

    async function handleAssignRole(roleId: string) {
        setShowRoleAssignModal(false);
        try {
            await assignRoomRole(roomId, roleId, auth.connectedUser.accessToken);
            setRolesRefreshKey((previous) => previous + 1);
            toast.success("Role assigned!");
        }
        catch (error) {
            console.error("Failed to assign role " + roleId + " to room " + roomId, error);
        }
    }

    async function handleRemoveRole() {
        if (!roleToRemove) return;

        try {
            await removeRoomRole(roomId, roleToRemove.id, auth.connectedUser.accessToken);
            setRoleToRemove(undefined);
            setRolesRefreshKey((previous) => previous + 1);
            toast.success("Role removed!");
        }
        catch (error) {
            console.error("Failed to remove role " + roleToRemove.id + " from room " + roomId, error);
        }
    }

    async function _handleEnable() {
        try {
            await enableRoom(roomId, auth.connectedUser.accessToken);
            setRoomDetails((previous) => previous ? { ...previous, active: true } : previous);
            toast.success("Room enabled!");
        }
        catch (error) {
            console.error("Failed to enable room " + roomId, error);
        }
    }

    async function _handleDisable() {
        try {
            await disableRoom(roomId, auth.connectedUser.accessToken);
            setRoomDetails((previous) => previous ? { ...previous, active: false } : previous);
            toast.success("Room disabled");
        }
        catch (error) {
            console.error("Failed to disable room " + roomId, error);
        }
    }

    async function _handleDelete() {
        try {
            await deleteRoom(roomId, auth.connectedUser.accessToken);
            toast.success("Room deleted!");
            navigate("/rooms", { replace: true, state: { refreshRooms: Date.now() } });
        }
        catch (error) {
            console.error("Failed to delete room " + roomId, error);
        }
    }

    useEffect(() => {
        let isActive = true;

        async function loadRole() {
            try {
                const room = await getRoom(roomId, auth.connectedUser.accessToken);

                const fetchedRoles = room.acl.length > 0
                    ? await lookupRoles({ roleIds: room.acl }, auth.connectedUser.accessToken)
                    : [];

                if (isActive) {
                    setRoomDetails(room);
                    setRoomRoles(fetchedRoles);
                }
            } catch (error) {
                console.error("Failed to load room " + roomId, error);
            }
        }

        void loadRole();

        return () => {
            isActive = false;
        };
    }, [roomId, rolesRefreshKey])

    const tagStyle = "tag" + (roomDetails?.active ? " is-success" : " is-danger");

    const roleBlocks = roomRoles && roomRoles.length > 0 ? (
        <div className="field is-grouped is-grouped-multiline">
            {roomRoles.map((role) => (
                <div key={role.id} className="control">
                    <div className="tags has-addons">
                        <NavLink className="tag is-link" to={"/roles/" + role.id}>{role.name}</NavLink>
                        <button className="tag is-delete" aria-label={"Remove " + role.name} onClick={() => setRoleToRemove(role)}></button>
                    </div>
                </div>
            ))}
        </div>
    ) : (<p className="subtitle is-7"> The room does not allow anyone to enter it</p>);

    const render = roomDetails ? (
        <div>
            <div className="card">
                <div className="card-content">
                    <div className="media-content">
                        <div className="is-flex is-flex-wrap-wrap is-flex-direction-row is-justify-content-space-between">
                            <div>
                                <span className="mr-3 title is-4">{roomDetails.name}</span>
                                <span className={tagStyle}>{roomDetails.active ? "Active" : "Disabled"}</span>
                            </div>
                            <div style={{ float: "right" }}>
                                <button className="button is-warning mr-1" onClick={roomDetails.active ? _handleDisable : _handleEnable}>{roomDetails.active ? "Disable" : "Enable"}</button>
                                <button className="button is-danger" onClick={() => setShowDeleteModal(true)}>Delete</button>
                            </div>
                        </div>
                        <p>{roomDetails.description}</p>
                    </div>
                    <br />
                    <div>
                        <p className="title is-6">Roles</p>
                        {roleBlocks}
                        <button className="button is-small is-outlined is-primary is-rounded" onClick={() => setShowRoleAssignModal(true)}>+</button>
                    </div>
                    <br />
                    <p>Created at: {new Date(roomDetails.createdAt).toUTCString()}</p>
                    <p>Updated at: {new Date(roomDetails.updatedAt).toUTCString()}</p>
                </div>
            </div>
            <div>
                {showDeleteModal && <ConfirmationModal text="Are you sure?" subtext="This action cannot be undone!" onConfirm={_handleDelete} onCancel={() => setShowDeleteModal(false)} />}
                {showRoleAssignModal && <AssignRoleModal excludeRoles={roomRoles} onConfirm={handleAssignRole} onCancel={() => setShowRoleAssignModal(false)} />}
                {roleToRemove && <ConfirmationModal text={"Remove " + roleToRemove.name + "?"} subtext="The role will no longer be allowed to enter this room." onConfirm={handleRemoveRole} onCancel={() => setRoleToRemove(undefined)} />}
            </div>
        </div>
    ) :
        (
            <div>
                <p className="title has-text-centered">Room not found</p>
            </div>
        )

    return render;
}

export default RoomDetails;
