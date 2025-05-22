import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "react-oidc-context";
import { User } from "oidc-client-ts";

const oidcConfig = {
  authority: "http://localhost:8787/",
  client_id: "0FAEa482fc4936553c27CB46ae6cBD4746503cB496331c5bD080a7476Ee24f25",
  redirect_uri: "http://localhost:5173/"
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
