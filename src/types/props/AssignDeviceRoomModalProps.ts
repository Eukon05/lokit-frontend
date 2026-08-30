import type { RoomResponse } from "../responses/room/RoomResponse";

export type AssignDeviceRoomModalProps = {
    onConfirm: (room: RoomResponse) => void,
    onCancel: () => void
};