import { createContext, useMemo } from "react";
import { useAuth } from "react-oidc-context";
import { jwtDecode } from "jwt-decode";
import type { AuthSession } from "../types/AuthSession";
import type { ReactNode } from "react";

export const AuthSessionContext = createContext<AuthSession | null>(null);
const roleClaims: string[] = import.meta.env.VITE_OIDC_ROLE_CLAIMS.split(",");

function AuthSessionProvider({ children }: { children: ReactNode }) {
    const auth = useAuth();
    const authSession = useMemo(() => {

        const token: string = auth.user?.access_token ?? "";
        const decodedToken: any = token ? jwtDecode(token) : {};
        const roles: string[] = [];

        roleClaims.forEach((claim: string) => {
            const paths: string[] = claim.split(".");

            let current: any = decodedToken;

            for (let i: number = 0; i < paths.length; i++) {
                if (current == null || typeof current !== "object")
                    return;
                current = current[paths[i]];
            }

            if (!Array.isArray(current))
                return;

            current.forEach((r: string) => {
                roles.push(r);
            })
        })

        const session: AuthSession = {
            isAuthenticated: auth.isAuthenticated,
            isLoading: auth.isLoading,
            connectedUser: {
                id: auth.user?.profile?.sub ?? "",
                accessToken: token,
                firstName: auth.user?.profile?.given_name ?? "",
                lastName: auth.user?.profile?.family_name ?? "",
                email: auth.user?.profile?.email ?? "",
                roles: roles
            },
            login: () => auth.signinRedirect(),
            logout: () => auth.signoutRedirect({
                post_logout_redirect_uri: window.location.origin
            }),
            hasRole: (role: string) => roles.includes(role),
            hasAnyRole: (searchRoles: string[]) => searchRoles.some(r => roles.includes(r))
        }

        return session;
    }, [auth]);

    return (
        <AuthSessionContext.Provider value={authSession}>
            {children}
        </AuthSessionContext.Provider>
    );
}

export default AuthSessionProvider;
