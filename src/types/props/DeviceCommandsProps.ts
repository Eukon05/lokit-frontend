import type { DeviceCommandResponse } from "../responses/device/DeviceCommandResponse"

export type DeviceCommandsProps = {
    deviceId: string,
    commands: DeviceCommandResponse[]
}