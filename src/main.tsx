import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "react-oidc-context";
import { User } from "oidc-client-ts";

const oidcConfig = {
  authority: import.meta.env.VITE_AUTHORITY_URI,
  client_id: import.meta.env.VITE_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  scope: "openid profile"
};

const onSigninCallback = (_user: User | void): void => {
  window.history.replaceState(
  {},
  document.title,
  window.location.pathname
  )
}
     
createRoot(document.getElementById('root')!).render(
  <AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}>
    <StrictMode>
      <App />
    </StrictMode>
  </AuthProvider>,
)
