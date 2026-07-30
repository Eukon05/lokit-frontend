import { useEffect, useRef } from "react";
import { Outlet } from "react-router";
import { withAuthenticationRequired } from "react-oidc-context";
import useAuthSession from "../hooks/AuthSessionHook";
import NotAuthorized from "../components/NotAuthorized";
import type { ProtectedRouteProps } from "../types/props/ProtectedRouteProps";

function PrivateRouteComponent({ requiredRoles }: ProtectedRouteProps) {
    const auth = useAuthSession();
    const backendUserSaved = useRef(false);

    useEffect(() => {
        if (!auth.isAuthenticated) {
            backendUserSaved.current = false;
            return;
        }

        if (backendUserSaved.current) {
            return;
        }

        backendUserSaved.current = true;
        void fetch("/api/v1/identity/me", {
            headers: {
                "Authorization": "Bearer " + auth.connectedUser.accessToken
            }
        });
    }, [auth.isAuthenticated, auth.connectedUser.accessToken]);

    if (requiredRoles !== undefined && requiredRoles.length > 0) {
        const filteredArray = auth.connectedUser.roles.filter(value => requiredRoles.includes(value));
        if (filteredArray.length == 0) return <NotAuthorized />
    }

    return <Outlet />
}

const ProtectedRoutes = withAuthenticationRequired(PrivateRouteComponent, {
    OnRedirecting: () => (<div>Redirecting...</div>)
});

export default ProtectedRoutes;