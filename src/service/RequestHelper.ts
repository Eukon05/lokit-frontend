import toast from "react-hot-toast";
import type { ApiErrorResponse } from "../types/responses/ApiErrorResponse";

export const SERVER_URL: string = import.meta.env.VITE_LOKIT_SERVER_URL;

async function _handleResponseStatus(response: Response){
    switch (response.status) {
        case 401:
            throw new Error("Unauthenticated!");
        case 403:
            throw new Error("Unauthorized!");
        case 404:
            throw new Error("Not found!");
        case 200:
        case 201:
            return;
        case 409: {
            const err: ApiErrorResponse = await response.json() as ApiErrorResponse;
            toast.error(err.message);
            throw new Error(err.message);
        }
        case 400: {
            const err: ApiErrorResponse = await response.json() as ApiErrorResponse;
            let toastMsg: string = (err.message ?? "Bad request") + "\n\n";

            Object.entries(err.errors ?? {}).forEach(([k, v]) => {
                toastMsg += k + ": " + v + "\n";
            });
            toast.error(toastMsg);
            throw new Error(err.message);
        }
        default:
            throw new Error("Unknown code!");
    }
}

export async function makeGet<T>(url: string, accessToken: string): Promise<T> {
    const response = await fetch(url, {
        headers: { Authorization: "Bearer " + accessToken }
    });

    _handleResponseStatus(response);
    return response.json() as Promise<T>;
}

export async function makeDelete(url: string, accessToken: string): Promise<void>{
    const response = await fetch(url, {
        headers: { Authorization: "Bearer " + accessToken },
        method: "DELETE"
    });

    _handleResponseStatus(response);
}

export async function makePost<T>(url: string, requestBody: T, accessToken: string): Promise<string>{
    const response = await fetch(url, {
        headers: { "Authorization": "Bearer " + accessToken, "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        method: "POST",
    });

    _handleResponseStatus(response);
    return await response.text();
}