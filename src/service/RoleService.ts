import { makeGet, SERVER_URL } from "./RequestHelper";
import type { RoleResponse } from "../types/responses/RoleResponse";
import type { RolePageResponse } from "../types/responses/RolePageResponse";

const ALL_ROLES_ENDPOINT = "/api/v1/role"

export async function getAllRoles(accessToken: string): Promise<RoleResponse[]> {
    return (await makeGet<RolePageResponse>(SERVER_URL + ALL_ROLES_ENDPOINT, accessToken)).content;
}