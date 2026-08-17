export const SERVER_URL: string = import.meta.env.VITE_LOKIT_SERVER_URL;

function _handleResponseStatus(responseStatus: number){
    switch (responseStatus) {
        case 401:
            throw new Error("Unauthenticated!");
        case 403:
            throw new Error("Unauthorized!");
        case 404:
            throw new Error("Not found!");
        case 200:
        case 201:
            return;
        default:
            throw new Error("Unknown code!");
    }
}

export async function makeGet<T>(url: string, accessToken: string): Promise<T> {
    const response = await fetch(url, {
        headers: { Authorization: "Bearer " + accessToken }
    });

    _handleResponseStatus(response.status);
    return response.json() as Promise<T>;
}

export async function makeDelete(url: string, accessToken: string): Promise<void>{
    const response = await fetch(url, {
        headers: { Authorization: "Bearer " + accessToken },
        method: "DELETE"
    });

    _handleResponseStatus(response.status);
}

export async function makePost<T>(url: string, requestBody: T, accessToken: string): Promise<string>{
    const response = await fetch(url, {
        headers: { "Authorization": "Bearer " + accessToken, "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        method: "POST",
    });

    _handleResponseStatus(response.status);
    return await response.text();
}