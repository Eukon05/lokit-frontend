import { makeDelete, makeGet, makePost, SERVER_URL } from "./RequestHelper";
import type { RoomPageResponse } from "../types/responses/room/RoomPageResponse";
import type { RoomResponse } from "../types/responses/room/RoomResponse";

const ALL_ROOMS_ENDPOINT = "/api/v1/room"
const ROOM_ENDPOINT = "/api/v1/room/"

export async function getAllRooms(accessToken: string): Promise<RoomResponse[]> {
    return (await makeGet<RoomPageResponse>(SERVER_URL + ALL_ROOMS_ENDPOINT, accessToken)).content;
}

export async function getRoom(roomId: string, accessToken: string): Promise<RoomResponse> {
    return (await makeGet<RoomResponse>(SERVER_URL + ROOM_ENDPOINT + roomId, accessToken));
}

export async function deleteRoom(roleId: string, accessToken: string): Promise<void> {
    await makeDelete(SERVER_URL + ROOM_ENDPOINT + roleId, accessToken);
}

export async function enableRoom(roleId: string, accessToken: string): Promise<void> {
    await makePost<null>(SERVER_URL + ROOM_ENDPOINT + roleId + "/enable", null, accessToken);
}

export async function disableRoom(roleId: string, accessToken: string): Promise<void> {
    await makePost<null>(SERVER_URL + ROOM_ENDPOINT + roleId + "/disable", null, accessToken);
}