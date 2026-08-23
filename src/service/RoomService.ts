import { makeDelete, makeGet, makePost, SERVER_URL } from "./RequestHelper";
import type { RoomPageResponse } from "../types/responses/room/RoomPageResponse";
import type { RoomResponse } from "../types/responses/room/RoomResponse";
import type { CreateRoomRequest } from "../types/requests/room/CreateRoomRequest";

const ALL_ROOMS_ENDPOINT = SERVER_URL + "/api/v1/room"
const ROOM_ENDPOINT = SERVER_URL + "/api/v1/room/"

export async function getAllRooms(accessToken: string): Promise<RoomResponse[]> {
    return (await makeGet<RoomPageResponse>(ALL_ROOMS_ENDPOINT, accessToken)).content;
}

export async function getRoom(roomId: string, accessToken: string): Promise<RoomResponse> {
    return (await makeGet<RoomResponse>(ROOM_ENDPOINT + roomId, accessToken));
}

export async function deleteRoom(roleId: string, accessToken: string): Promise<void> {
    await makeDelete(ROOM_ENDPOINT + roleId, accessToken);
}

export async function enableRoom(roleId: string, accessToken: string): Promise<void> {
    await makePost<null>(ROOM_ENDPOINT + roleId + "/enable", null, accessToken);
}

export async function disableRoom(roleId: string, accessToken: string): Promise<void> {
    await makePost<null>(ROOM_ENDPOINT + roleId + "/disable", null, accessToken);
}

export async function createRoom(body: CreateRoomRequest, accessToken: string): Promise<string> {
    return (await makePost<CreateRoomRequest>(ALL_ROOMS_ENDPOINT, body, accessToken));
}