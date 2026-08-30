import { useState, useEffect } from 'react'
import useAuthSession from '../../hooks/useAuthSession';
import { useLocation } from 'react-router';
import type { RoomResponse } from '../../types/responses/room/RoomResponse';
import { getAllRooms } from '../../service/RoomService';
import type { AssignDeviceRoomModalProps } from '../../types/props/AssignDeviceRoomModalProps';
import ConfirmationModal from '../common/ConfirmationModal';

function AssignDeviceRoomModal({ onConfirm, onCancel }: AssignDeviceRoomModalProps) {
    const auth = useAuthSession();
    const location = useLocation();
    const [rooms, setRooms] = useState<RoomResponse[]>();
    const [selectedRoomId, setSelectedRoomId] = useState("");

    function _handleConfirm() {
        const selectedRoom = rooms?.find((room) => room.id === selectedRoomId);
        if (selectedRoom) onConfirm(selectedRoom);
    }

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

    const roomSelector = rooms && rooms.length > 0 && (
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
    );

    return (
        <ConfirmationModal
            text="Which room would you like to assign?"
            subtext={roomSelector ? undefined : "There are no rooms left to assign"}
            children={roomSelector}
            onConfirm={_handleConfirm}
            onCancel={onCancel} 
            confirmDisabled={!roomSelector}
        />
    )
}

export default AssignDeviceRoomModal;