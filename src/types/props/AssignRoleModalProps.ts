import type { RoleResponse } from "../responses/role/RoleResponse"

export type AssignRoleModalProps = {
    excludeRoles?: RoleResponse[],
    onConfirm: (roleId: string) => void,
    onCancel: () => void
}