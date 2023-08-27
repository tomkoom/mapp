import { useContext, createContext, useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent, Identity, Agent } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";
import { _SERVICE } from "../declarations/backend/backend.did";

// use backend actor
import { createActor, canisterId } from "../declarations/backend";

export const AuthContext = createContext(null);
export const useAuth = () => {
  return useContext(AuthContext);
};

// constants
// .env variables change after deploy
const IS_LOCAL_NETWORK = process.env.DFX_NETWORK === "local";
const HOST = IS_LOCAL_NETWORK ? `http://localhost:3000/` : "https://icp0.io/";
const LOCAL_II = process.env.CANISTER_ID_INTERNET_IDENTITY;
const IDENTITY_PROVIDER = IS_LOCAL_NETWORK
  ? `http://127.0.0.1:4943/?canisterId=${LOCAL_II}`
  : "https://identity.ic0.app/";

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [userPrincipal, setUserPrincipal] = useState<Principal | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [actor, setActor] = useState<Actor | null>(null);

  const init = () => {
    reset();
  };

  useEffect(() => {
    init();
  }, []);

  const reset = async () => {
    let authClient: AuthClient = null;
    let isAuthenticated = false;
    let identity: Identity = null;
    let userPrincipal: Principal = null;
    let agent: HttpAgent = null;
    let actor: Actor = null;

    authClient = await AuthClient.create();
    isAuthenticated = await authClient.isAuthenticated();
    identity = authClient.getIdentity();
    userPrincipal = identity.getPrincipal();
    agent = new HttpAgent({
      host: HOST,
      identity,
    });
    actor = createActor(canisterId, {
      agent,
    });

    setAuthClient(authClient);
    setIsAuthenticated(isAuthenticated);
    setIdentity(identity);
    setUserPrincipal(userPrincipal);
    setAgent(agent);
    setActor(actor);
  };

  const login = async () => {
    if (isAuthenticated) throw new Error("already logged in");
    console.log(IS_LOCAL_NETWORK);
    console.log(LOCAL_II);
    console.log(IDENTITY_PROVIDER);

    await authClient.login({
      identityProvider: IDENTITY_PROVIDER,
      // maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
      onSuccess: async () => {
        await reset();
      },
    });
  };

  const logout = async () => {
    if (!isAuthenticated) throw new Error("not logged in");
    await authClient.logout();

    await reset();
    return reset();
  };

  const value = {
    authClient,
    isAuthenticated,
    identity,
    userPrincipal,
    agent,
    actor,

    // ...
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
