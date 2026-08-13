import { makeGet, SERVER_URL } from "./RequestHelper";
import type { RoomPageResponse } from "../types/responses/room/RoomPageResponse";
import type { RoomResponse } from "../types/responses/room/RoomResponse";

const ALL_ROOMS_ENDPOINT = "/api/v1/room"

export async function getAllRooms(accessToken: string): Promise<RoomResponse[]> {
    return (await makeGet<RoomPageResponse>(SERVER_URL + ALL_ROOMS_ENDPOINT, accessToken)).content;
}