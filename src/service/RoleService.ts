import { makeDelete, makeGet, makePost, SERVER_URL } from "./RequestHelper";
import type { RoleResponse } from "../types/responses/role/RoleResponse";
import type { RolePageResponse } from "../types/responses/role/RolePageResponse";
import type { LookupRolesRequest } from "../types/requests/role/LookupRolesRequest";
import type { UserRolesResponse } from "../types/responses/user/UserRolesResponse";

const ALL_ROLES_ENDPOINT = "/api/v1/role";
const ROLE_ENDPOINT = "/api/v1/role";
const ROLE_LOOKUP_ENDPOINT = "/api/v1/role/lookup";
const USER_ENDPOINT = "/api/v1/user/";

export async function getAllRoles(accessToken: string): Promise<RoleResponse[]> {
    return (await makeGet<RolePageResponse>(SERVER_URL + ALL_ROLES_ENDPOINT, accessToken)).content;
}

export async function getRole(roleId: string, accessToken: string): Promise<RoleResponse> {
    return (await makeGet<RoleResponse>(SERVER_URL + ROLE_ENDPOINT + "/" + roleId, accessToken));
}

export async function deleteRole(roleId: string, accessToken: string): Promise<void> {
    await makeDelete(SERVER_URL + ROLE_ENDPOINT + "/" + roleId, accessToken);
}

export async function enableRole(roleId: string, accessToken: string): Promise<void> {
    await makePost<null>(SERVER_URL + ROLE_ENDPOINT + "/" + roleId + "/enable", null, accessToken);
}

export async function disableRole(roleId: string, accessToken: string): Promise<void> {
    await makePost<null>(SERVER_URL + ROLE_ENDPOINT + "/" + roleId + "/disable", null, accessToken);
}

export async function lookupRoles(dto: LookupRolesRequest, accessToken: string): Promise<RoleResponse[]> {
    return JSON.parse(await makePost<LookupRolesRequest>(SERVER_URL + ROLE_LOOKUP_ENDPOINT, dto, accessToken)) as Promise<RoleResponse[]>;
}

export async function getUserRoles(userId: string, accessToken: string): Promise<UserRolesResponse>{
    return (await makeGet<UserRolesResponse>(SERVER_URL + USER_ENDPOINT + userId, accessToken));
}