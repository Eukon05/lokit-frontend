export const SERVER_URL: string = import.meta.env.VITE_LOKIT_SERVER_URL;

export async function makeGet<T>(url: string, accessToken: string): Promise<T> {
    const response = await fetch(url, {
        headers: { Authorization: "Bearer " + accessToken }
    });

    switch (response.status) {
        case 401:
            throw new Error("Unauthenticated!");
        case 403:
            throw new Error("Unauthorized!");
        case 200:
            return response.json() as Promise<T>;
        default:
            throw new Error("Unknown code!");
    }
}