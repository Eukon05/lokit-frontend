import { makeDelete, makeGet, makePost, SERVER_URL } from "./RequestHelper";
import type { DeviceResponse } from "../types/responses/device/DeviceResponse";
import type { DevicePageResponse } from "../types/responses/device/DevicePageResponse";
import type { CreateDeviceRequest } from "../types/requests/device/CreateDeviceRequest";

const ALL_DEVICES_ENDPOINT = SERVER_URL + "/api/v1/device"
const DEVICE_ENDPOINT = SERVER_URL + "/api/v1/device/"

export async function getAllDevices(accessToken: string): Promise<DeviceResponse[]> {
    return (await makeGet<DevicePageResponse>(ALL_DEVICES_ENDPOINT, accessToken)).content;
}

export async function getDevice(deviceId: string, accessToken: string): Promise<DeviceResponse> {
    return (await makeGet<DeviceResponse>(DEVICE_ENDPOINT + deviceId, accessToken));
}

export async function deleteDevice(deviceId: string, accessToken: string): Promise<void> {
    await makeDelete(DEVICE_ENDPOINT + deviceId, accessToken);
}

export async function assignToken(deviceId: string, accessToken: string): Promise<string> {
    return await makePost<null>(DEVICE_ENDPOINT + deviceId + "/token", null, accessToken);
}

export async function removeToken(deviceId: string, accessToken: string): Promise<void> {
    await makeDelete(DEVICE_ENDPOINT + deviceId + "/token", accessToken);
}

export async function createDevice(body: CreateDeviceRequest, accessToken: string): Promise<string> {
    return (await makePost<CreateDeviceRequest>(ALL_DEVICES_ENDPOINT, body, accessToken));
}