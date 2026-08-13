import type { UsersPageResponse } from "../types/responses/UsersPageResponse";
import type { UserResponse } from "../types/responses/UserResponse";

const SERVER_URL: string = import.meta.env.VITE_LOKIT_SERVER_URL;
const ALL_IDP_USERS_ENDPOINT: string = "/api/v1/identity"

export async function getIdPAllUsers(accessToken: string): Promise<UserResponse[]> {
    return (await makeGet<UsersPageResponse>(SERVER_URL + ALL_IDP_USERS_ENDPOINT, accessToken)).content;
}

async function makeGet<T>(url: string, accessToken: string): Promise<T> {
    const response = await fetch(url, {
        headers: { Authorization: "Bearer " + accessToken }
    });

    switch (response.status) {
        case 401:
            throw new Error("Unauthenticated!");
        case 403:
            throw new Error("Unauthorized!");
        case 200:
            return response.json() as Promise<T>;
        default:
            throw new Error("Unknown code!");
    }
}