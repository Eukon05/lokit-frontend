import { makeGet, SERVER_URL } from "./RequestHelper";
import type { UsersPageResponse } from "../types/responses/user/UsersPageResponse";
import type { UserResponse } from "../types/responses/user/UserResponse";

const ALL_IDP_USERS_ENDPOINT: string = "/api/v1/identity"
const IDP_USER_ENDPOINT: string = "/api/v1/identity/";

export async function getIdPAllUsers(accessToken: string): Promise<UserResponse[]> {
    return (await makeGet<UsersPageResponse>(SERVER_URL + ALL_IDP_USERS_ENDPOINT, accessToken)).content;
}

export async function getUser(userId: string, accessToken: string): Promise<UserResponse> {
    return (await makeGet<UserResponse>(SERVER_URL + IDP_USER_ENDPOINT + '/' + userId, accessToken));
}