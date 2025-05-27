import './App.css'
import { useAuth } from "react-oidc-context";
import { useState } from "react";

function App() {
    const auth = useAuth();
    const [name, setName] = useState("OK (Click to Update!)");

    //console.log("Profile=", JSON.stringify(auth.user?.profile))

    switch (auth.activeNavigator) {
        case "signinSilent":
            return <div>Signing you in...</div>;
        case "signoutRedirect":
            return <div>Signing you out...</div>;
    }

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.error) {
        return <div>Oops... {auth.error.source} caused {auth.error.message}</div>;
    }

    if (auth.isAuthenticated) {
        const token = auth.user?.access_token;
        return (
        <div>
            Hello {auth.user?.profile.first_name as string}{' '}{auth.user?.profile.last_name as string}
            <br />{(auth.user?.profile.roles as string[]).includes("sketch_auth_admin") ? <button
          onClick={() => {
            fetch("/api/", {
                 headers: {
                        Authorization: `Bearer ${token}`,
                    }
            })
              .then((res) => res.json() as Promise<{ name: string }>)
              .then((data) => setName(data.name));
          }}
          aria-label="get name"
        >
          Current Status: {name}
        </button> : "Nothing for you, you are not special (enough)"}
            <br /><button onClick={() => void auth.removeUser()}>Log out</button>
        </div>
        );
    }

    return <button onClick={() => void auth.signinRedirect()}>Log in</button>;
}

export default App;