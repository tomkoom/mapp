import { useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";
import { backend } from "./declarations/backend";
import type { ICRC1Value } from "./declarations/backend/backend.did";

// auth
import { useAuth } from "./context/Auth";

// components
import { Nav } from "./components/layout/_index";

interface User {
  id: string;
}

const IS_LOCAL_NETWORK = process.env.DFX_NETWORK == "local";

function App() {
  const { identity } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [tokenMeta, setTokenMeta] = useState<any>();

  useEffect(() => {
    const addUser = async (): Promise<void> => {
      if (identity) {
        const userId = identity.getPrincipal().toString();
        await backend.addUser(userId);
        await refreshUsers();
      }
    };
    addUser();
  }, [identity]);

  const refreshUsers = async (): Promise<void> => {
    const users = await backend.getUsers();
    setUsers(users);
  };

  const getTokenMeta = async (): Promise<void> => {
    const meta: [string, ICRC1Value][] = await backend.icrc1_metadata();

    // format
    const decimals = { [meta[0][0]]: String(Object.values(meta[0][1])[0]) };
    const name = { [meta[1][0]]: Object.values(meta[1][1])[0] };
    const symbol = { [meta[2][0]]: Object.values(meta[2][1])[0] };
    const fee = { [meta[3][0]]: String(Object.values(meta[3][1])[0]) };
    const metaFormatted = { ...decimals, ...name, ...symbol, ...fee };
    setTokenMeta(metaFormatted);
  };

  useEffect(() => {
    refreshUsers();
    !IS_LOCAL_NETWORK && getTokenMeta();
  }, []);

  return (
    <div className="app">
      <Nav />

      <div className="main">
        {tokenMeta && (
          <div>
            <h3>token</h3>
            <pre>{JSON.stringify(tokenMeta, null, 2)}</pre>
          </div>
        )}

        <div>
          <h3>users</h3>
          <Users>
            {users.map((user) => (
              <li key={user.id}>
                <code>{user.id}</code>
              </li>
            ))}
          </Users>
        </div>
      </div>
    </div>
  );
}

const Users = styled.ul``;

export default App;
