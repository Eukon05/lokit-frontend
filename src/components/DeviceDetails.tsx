import { useState, useEffect } from "react";
import { deleteDevice, removeToken, assignToken, getDevice } from "../service/DeviceService";
import { getRoom } from "../service/RoomService";
import type { DeviceDetailsProps } from "../types/props/DeviceDetailsProps";
import type { DeviceResponse } from "../types/responses/device/DeviceResponse";
import type { RoomResponse } from "../types/responses/room/RoomResponse";
import useAuthSession from "../hooks/useAuthSession";
import { NavLink, useNavigate } from "react-router";
import ConfirmationModal from "./ConfirmationModal";

function DeviceDetails({ deviceId }: DeviceDetailsProps) {
    const auth = useAuthSession();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showRevokeModal, setShowRevokeModal] = useState<boolean>(false);
    const [deviceDetails, setDeviceDetails] = useState<DeviceResponse>();
    const [roomDetails, setRoomDetails] = useState<RoomResponse>();
    const [deviceToken, setDeviceToken] = useState<string>();

    async function _handleAssignToken() {
        try {
            const token = await assignToken(deviceId, auth.connectedUser.accessToken);
            setDeviceDetails((previous) => previous ? { ...previous, hasActiveToken: true } : previous);
            setDeviceToken(token);
        }
        catch (error) {
            console.error("Failed to enable device " + deviceId, error);
        }
    }

    async function _handleRemoveToken() {
        try {
            await removeToken(deviceId, auth.connectedUser.accessToken);
            setDeviceDetails((previous) => previous ? { ...previous, hasActiveToken: false } : previous);
            setDeviceToken(undefined);
        }
        catch (error) {
            console.error("Failed to disable device " + deviceId, error);
        }
        finally {
            setShowRevokeModal(false);
        }
    }

    async function _handleDelete() {
        try {
            await deleteDevice(deviceId, auth.connectedUser.accessToken);
            navigate("/devices", { replace: true, state: { refreshDevices: Date.now() } });
        }
        catch (error) {
            console.error("Failed to delete device " + deviceId, error);
        }
    }

    useEffect(() => {
        let isActive = true;

        async function loadDevice() {
            try {
                const device = await getDevice(deviceId, auth.connectedUser.accessToken);
                const hasRoom = Boolean(device.roomId && device.roomId.trim().length > 0);
                const room = hasRoom ? await getRoom(device.roomId, auth.connectedUser.accessToken) : undefined;

                if (isActive) {
                    setDeviceDetails(device);
                    setRoomDetails(room);
                }
            } catch (error) {
                console.error("Failed to load device " + deviceId, error);
            }
        }

        void loadDevice();

        return () => {
            isActive = false;
        };
    }, [deviceId])

    const hasAssignedRoom = Boolean(deviceDetails?.roomId && deviceDetails.roomId.trim().length > 0);
    const tagStyle = "tag" + (deviceDetails?.hasActiveToken ? " is-success" : " is-danger");
    const tagText = deviceDetails?.hasActiveToken ? "Active" : "Disabled";

    const deviceTokenDiv = deviceToken && <div className="message">
        <br />
        <div className="message-header">
            <p>Device token</p>
        </div>
        <div className="message-body is-flex is-flex-direction-row is-justify-content-space-between">
            <p>{deviceToken}</p>
            <button className="button" onClick={() => navigator.clipboard.writeText(deviceToken)}>Copy</button>
        </div>
    </div>

    const render = deviceDetails ? (
        <div>
            <div className="card">
                <div className="card-content">
                    <div className="media-content">
                        <div className="is-flex is-flex-wrap-wrap is-flex-direction-row is-justify-content-space-between">
                            <div>
                                <span className="mr-3 title is-4">{deviceDetails.name}</span>
                                <span className={tagStyle}>{tagText}</span>
                            </div>
                            <div style={{ float: "right" }}>
                                <button className="button is-warning mr-1" onClick={deviceDetails.hasActiveToken ? () => setShowRevokeModal(true) : _handleAssignToken}>{deviceDetails.hasActiveToken ? "Revoke token" : "Assign token"}</button>
                                <button className="button is-danger" onClick={() => setShowDeleteModal(true)}>Delete</button>
                            </div>
                        </div>
                        <div>
                            <p>{deviceDetails.description}</p>
                            <br />
                            <p>Physical address: {deviceDetails.physicalAddress}</p>
                            <p>Belongs to room: {hasAssignedRoom ? (<NavLink to={"/rooms/" + roomDetails?.id}>{roomDetails?.name}</NavLink>) : "None"}</p>
                        </div>
                        {deviceTokenDiv}
                        <br />
                        <p>Created at: {new Date(deviceDetails.createdAt).toUTCString()}</p>
                        <p>Updated at: {new Date(deviceDetails.updatedAt).toUTCString()}</p>
                    </div>
                </div>
            </div>
            <div>
                {showDeleteModal && <ConfirmationModal text="Are you sure?" subtext="This action cannot be undone!" onConfirm={_handleDelete} onCancel={() => setShowDeleteModal(false)} />}
            </div>
            <div>
                {showRevokeModal && <ConfirmationModal text="Are you sure?" subtext="Revoking the token will render the device unusable, and will require uploading the new token to it manually!" onConfirm={_handleRemoveToken} onCancel={() => setShowRevokeModal(false)} />}
            </div>
        </div>
    ) :
        (
            <div>
                <p className="title has-text-centered">Device not found</p>
            </div>
        )

    return render;
}

export default DeviceDetails;
