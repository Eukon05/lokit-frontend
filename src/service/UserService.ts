import { makeDelete, makeGet, makePost, SERVER_URL } from "./RequestHelper";
import type { UsersPageResponse } from "../types/responses/user/UsersPageResponse";
import type { UserResponse } from "../types/responses/user/UserResponse";
import type { UserRolesResponse } from "../types/responses/user/UserRolesResponse";

const ALL_IDP_USERS_ENDPOINT: string = SERVER_URL + "/api/v1/identity?sort=lastName,asc&sort=firstName,asc&size=20&page="
const IDP_USER_ENDPOINT: string = SERVER_URL + "/api/v1/identity/";
const SYNC_IDP_USERS_ENDPOINT: string = SERVER_URL + "/api/v1/identity/sync";
const USER_ENDPOINT: string = SERVER_URL + "/api/v1/user/";

export async function getIdPAllUsers(accessToken: string, page: number = 0): Promise<UsersPageResponse> {
    return (await makeGet<UsersPageResponse>(ALL_IDP_USERS_ENDPOINT + page, accessToken));
}

export async function getUser(userId: string, accessToken: string): Promise<UserResponse> {
    return (await makeGet<UserResponse>(IDP_USER_ENDPOINT + userId, accessToken));
}

export async function syncIdpUsers(accessToken: string): Promise<void> {
    await makePost<null>(SYNC_IDP_USERS_ENDPOINT, null, accessToken);
}

export async function getUserRoles(userId: string, accessToken: string): Promise<UserRolesResponse>{
    return (await makeGet<UserRolesResponse>(USER_ENDPOINT + userId + "/roles", accessToken));
}

export async function assignUserRole(userId: string, roleId: string, accessToken: string): Promise<void> {
    await makePost<null>(USER_ENDPOINT + userId + "/roles/" + roleId, null, accessToken);
}

export async function removeUserRole(userId: string, roleId: string, accessToken: string): Promise<void> {
    await makeDelete(USER_ENDPOINT + userId + "/roles/" + roleId, accessToken);
}