import type { IdpUser } from "./IdpUser";

export type AuthSession = {
    isAuthenticated: boolean,
    isLoading: boolean,
    connectedUser: IdpUser,
    login: () => Promise<void>,
    logout: () => Promise<void>
}