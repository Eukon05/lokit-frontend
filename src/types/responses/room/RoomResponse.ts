export type RoomResponse = {
    id: string,
    name: string,
    description: string,
    active: boolean,
    acl: string[],
    createdAt: string,
    updatedAt: string
}