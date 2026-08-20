import { makeGet, makePost, SERVER_URL } from "./RequestHelper";
import type { UsersPageResponse } from "../types/responses/user/UsersPageResponse";
import type { UserResponse } from "../types/responses/user/UserResponse";

const ALL_IDP_USERS_ENDPOINT: string = SERVER_URL + "/api/v1/identity"
const IDP_USER_ENDPOINT: string = SERVER_URL + "/api/v1/identity/";
const SYNC_IDP_USERS_ENDPOINT: string = SERVER_URL + "/api/v1/identity/sync";

export async function getIdPAllUsers(accessToken: string): Promise<UserResponse[]> {
    return (await makeGet<UsersPageResponse>(ALL_IDP_USERS_ENDPOINT, accessToken)).content;
}

export async function getUser(userId: string, accessToken: string): Promise<UserResponse> {
    return (await makeGet<UserResponse>(IDP_USER_ENDPOINT + userId, accessToken));
}

export async function syncIdpUsers(accessToken: string): Promise<void> {
    await makePost<null>(SYNC_IDP_USERS_ENDPOINT, null, accessToken);
}