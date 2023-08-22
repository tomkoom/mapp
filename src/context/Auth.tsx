import { useContext, createContext, useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../declarations/backend";
import { _SERVICE } from "../declarations/backend/backend.did";

export const AuthContext = createContext(null);
const useAuth = () => {
  return useContext(AuthContext);
};
export { useAuth };

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [actor, setActor] = useState<Actor | null>(null);

  const init = async () => {
    const authClient = await AuthClient.create();
    const isAuth = await authClient.isAuthenticated();
    setAuthClient(authClient);

    if (isAuth) {
      handleAuth(authClient);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleAuth = (authClient: AuthClient) => {
    const identity = authClient.getIdentity();
    const userId = identity.getPrincipal().toString();
    const agent = new HttpAgent({ identity });
    const canisterId = process.env.CANISTER_ID_BACKEND;

    const actor = Actor.createActor<_SERVICE>(idlFactory, {
      agent,
      canisterId,
    });
    setUserId(userId);
    setActor(actor);
  };

  const login = async () => {
    await authClient.login({
      onSuccess: async () => {
        handleAuth(authClient);
      },
    });
  };

  const logout = async () => {
    await authClient.logout();
    setUserId("");
    setActor(null);
  };

  const value = { userId, actor, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
