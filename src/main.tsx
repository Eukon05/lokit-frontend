import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "react-oidc-context";
import { userManager, onSigninCallback } from './config/OidcConfig.ts'
import "bulma/css/bulma.css"
import App from './App.tsx'
import AuthSessionProvider from './contexts/AuthSessionContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider userManager={userManager} onSigninCallback={onSigninCallback}>
      <AuthSessionProvider>
        <App />
      </AuthSessionProvider>
    </AuthProvider>
  </StrictMode>,
)
