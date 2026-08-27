import type { RoleResponse } from "../responses/role/RoleResponse"

export type AssignRoleModalProps = {
    excludeRoles?: RoleResponse[],
    onConfirm: (role: RoleResponse) => void,
    onCancel: () => void
}