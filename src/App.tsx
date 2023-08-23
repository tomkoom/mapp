import { useEffect, useState } from "react";
import styled from "styled-components";
import { size } from "./styles/breakpoints";
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
  const [tokenMeta, setTokenMeta] = useState<any>({});
  const id = identity && identity.getPrincipal().toString();
  const token = {
    "icrc1:decimals": "8",
    "icrc1:name": "tkn",
    "icrc1:symbol": "TKN",
    "icrc1:fee": "100000",
  };

  useEffect(() => {
    const addUser = async (): Promise<void> => {
      if (identity) {
        const userId = identity.getPrincipal();
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
    <div>
      <Nav />

      <Main>
        <div>
          <h3 className="sectionTitle">token</h3>
          <Token>
            <a
              href="https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/?id=6jhti-pyaaa-aaaag-abnwa-cai"
              target="_blank"
              rel="noreferrer noopener"
            >
              token interface
            </a>
            <pre>
              {IS_LOCAL_NETWORK
                ? JSON.stringify(token, null, 2)
                : JSON.stringify(tokenMeta, null, 2)}
            </pre>
          </Token>
        </div>

        <div>
          <h3 className="sectionTitle">registered users</h3>
          <ul>
            {users.map((user) => (
              <li
                style={
                  id === user.id
                    ? { backgroundColor: "var(--underlay1)" }
                    : null
                }
                key={user.id}
              >
                {user.id}
              </li>
            ))}
          </ul>
        </div>
      </Main>
    </div>
  );
}

const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  max-width: ${size.tablet}px;
  margin: 0 auto;
  padding: 2rem;
`;

const Token = styled.div`
  > a {
    display: inline-block;
    margin-bottom: 0.25rem;
  }

  > pre {
    background-color: var(--underlay1);
    padding: 1rem;
  }
`;

export default App;
