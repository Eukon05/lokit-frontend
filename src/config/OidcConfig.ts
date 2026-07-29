import { UserManager } from 'oidc-client-ts'
import type { User } from 'oidc-client-ts';

export const onSigninCallback = (_user: User | undefined): void => {
    window.history.replaceState({}, document.title, window.location.pathname);
}

export const userManager: UserManager = new UserManager(
    {
        authority: import.meta.env.VITE_OIDC_AUTHORITY,
        client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
        redirect_uri: `${window.location.origin}${window.location.pathname}`,
        post_logout_redirect_uri: window.location.origin
    }
);