import { useState, useEffect } from "react";
import { getDevice } from "../service/DeviceService";
import { getRoom } from "../service/RoomService";
import type { DeviceDetailsProps } from "../types/props/DeviceDetailsProps";
import type { DeviceResponse } from "../types/responses/device/DeviceResponse";
import type { RoomResponse } from "../types/responses/room/RoomResponse";
import useAuthSession from "../hooks/useAuthSession";
import { NavLink } from "react-router";

function DeviceDetails({ deviceId }: DeviceDetailsProps) {
    const auth = useAuthSession();
    const [deviceDetails, setDeviceDetails] = useState<DeviceResponse>();
    const [roomDetails, setRoomDetails] = useState<RoomResponse>();

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
    const tagStyle = !hasAssignedRoom
        ? "tag has-background-grey-light has-text-grey-dark"
        : "tag" + (deviceDetails?.hasActiveToken ? " is-success" : " is-danger");
    const tagText = !hasAssignedRoom
        ? "Unassigned"
        : (deviceDetails?.hasActiveToken ? "Active" : "Disabled");

    const render = deviceDetails ? (
        <div className="card">
            <div className="card-content">
                <div className="media-content">
                    <div className="is-flex is-flex-wrap-wrap is-flex-direction-row is-justify-content-space-between">
                        <div>
                            <span className="mr-3 title is-4">{deviceDetails.name}</span>
                            <span className={tagStyle}>{tagText}</span>
                        </div>
                        <div style={{ float: "right" }}>
                            <button className="button is-warning mr-1">Disable</button>
                            <button className="button is-danger">Delete</button>
                        </div>
                    </div>
                    <div>
                        <p>{deviceDetails.description}</p>
                        <br />
                        <p>Physical address: {deviceDetails.physicalAddress}</p>
                        <p>Belongs to room: {hasAssignedRoom ? (<NavLink to={"/rooms/" + roomDetails?.id}>{roomDetails?.name}</NavLink>) : "None"}</p>
                    </div>
                </div>
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
