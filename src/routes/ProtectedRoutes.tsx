import { useEffect } from "react";
import { Outlet } from "react-router";
import { withAuthenticationRequired } from "react-oidc-context";
import useAuthSession from "../hooks/useAuthSession";
import NotAuthorized from "../pages/NotAuthorized";
import type { ProtectedRouteProps } from "../types/props/ProtectedRouteProps";

function PrivateRouteComponent({ allowedRoles }: ProtectedRouteProps) {
    const auth = useAuthSession();

    useEffect(() => {
        if (!auth.isAuthenticated) {
            return;
        }

        void fetch("/api/v1/identity/me", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + auth.connectedUser.accessToken
            }
        });
    }, [auth.connectedUser.accessToken]);

    if (allowedRoles !== undefined && allowedRoles.length > 0) {
        if (!auth.hasAnyRole(allowedRoles)) return <NotAuthorized />
    }

    return <Outlet />
}

const ProtectedRoutes = withAuthenticationRequired(PrivateRouteComponent, {
    OnRedirecting: () => (<div>Redirecting...</div>)
});

export default ProtectedRoutes;