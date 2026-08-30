import { useState, useEffect } from 'react'
import useAuthSession from '../../hooks/useAuthSession';
import { useLocation } from 'react-router';
import type { RoomResponse } from '../../types/responses/room/RoomResponse';
import { getAllRooms } from '../../service/RoomService';
import type { AssignDeviceRoomModalProps } from '../../types/props/AssignDeviceRoomModalProps';

function AssignDeviceRoomModal({ onConfirm, onCancel }: AssignDeviceRoomModalProps) {
    const auth = useAuthSession();
    const location = useLocation();
    const [rooms, setRooms] = useState<RoomResponse[]>();
    const [selectedRoomId, setSelectedRoomId] = useState("");

    useEffect(() => {
        let isActive = true;

        async function loadRooms() {
            try {
                let allRooms = await getAllRooms(auth.connectedUser.accessToken);

                if (isActive) {
                    setRooms(allRooms);
                    setSelectedRoomId(allRooms[0]?.id ?? "");
                }
            } catch (error) {
                console.error("Failed to load rooms", error);
            }
        }

        void loadRooms();

        return () => {
            isActive = false;
        };
    }, [auth.connectedUser.accessToken, location.state?.refreshRoles])

    const roomSelector = rooms && rooms.length > 0 ? (
        <div className="field">
            <div className="control">
                <div className='select'>
                    <select value={selectedRoomId}
                        onChange={(event) => setSelectedRoomId(event.target.value)}>
                        {rooms?.sort((o, t) => o.name.localeCompare(t.name))
                            .map(u => {
                                return <option key={u.id} value={u.id}>{u.name}</option>
                            })}
                    </select>
                </div>
            </div>
        </div>
    ) : <p>There are no rooms to assign</p>

    return (
        <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-content">
                <div className="box">
                    <p className="title is-4">Which room would you like to assign?</p>
                    {roomSelector}
                    <div className="is-flex is-flex-direction-row is-flex-justify-content-space-between">
                        <button className="button is-danger mr-1" disabled={!selectedRoomId} onClick={() => {
                            const selectedRoom = rooms?.find((room) => room.id === selectedRoomId);
                            if (selectedRoom) onConfirm(selectedRoom);
                        }}>Confirm</button>
                        <button className="button" onClick={onCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AssignDeviceRoomModal;