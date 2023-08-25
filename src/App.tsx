import { useEffect, useState } from "react";
import styled from "styled-components";

import { backend } from "./declarations/backend";
import type { Principal } from "@dfinity/principal";

// auth
import { useAuth } from "./context/Auth";

// hooks
import useUsers from "./hooks/useUsers";

// components
import { Nav } from "./components/layout/_index";
import { Map } from "./panels/_index";

interface ICRC1Account {
  owner: Principal;
  subaccount: [] | [Uint8Array | number[]];
}

interface ICRC1TransferArgs {
  to: ICRC1Account;
  fee: [] | [bigint];
  memo: [] | [Uint8Array | number[]];
  from_subaccount: [] | [Uint8Array | number[]];
  created_at_time: [] | [bigint];
  amount: bigint;
}

interface User {
  id: string;
}

const IS_LOCAL_NETWORK = process.env.DFX_NETWORK === "local";

function App() {
  const { userPrincipal } = useAuth();
  const { users, refreshUsers } = useUsers();
  const [balance, setBalance] = useState<string>("");
  const [mapIsLoaded, setMapIsLoaded] = useState<boolean>(false);
  const [selected, setSelected] = useState<google.maps.LatLngLiteral | null>(
    null,
  );
  const userId = userPrincipal && userPrincipal.toString();

  const userExists = async (): Promise<boolean> => {
    const exists = await backend.userExists(userPrincipal);
    console.log(exists ? "user exists" : "user is new");
    return exists;
  };

  const addUser = async (userPrincipal: Principal): Promise<void> => {
    await backend.addUser(userPrincipal);
    await refreshUsers();
    console.log(`user with id ${userPrincipal.toString()} added to db`);
  };

  const sendTokens = async (): Promise<void> => {
    const to: ICRC1Account = { owner: userPrincipal, subaccount: [] };
    const amount = BigInt(1000 * 10 ** 8);
    const transferArgs: ICRC1TransferArgs = {
      to,
      amount,
      from_subaccount: [],
      fee: [],
      memo: [],
      created_at_time: [],
    };

    await backend
      .icrc1_transfer(transferArgs)
      .then(() => console.log("tokens sent"));
  };

  const refreshBalance = async (): Promise<void> => {
    const account: ICRC1Account = { owner: userPrincipal, subaccount: [] };
    const balance = await backend.icrc1_balance_of(account);
    setBalance((Number(balance) / 10 ** 8).toFixed(2));
    console.log("balance refreshed");
  };

  const registerNewUser = async () => {
    const exists = await userExists();
    if (!exists) {
      await addUser(userPrincipal);
      if (!IS_LOCAL_NETWORK) {
        await sendTokens();
      }
    }
  };

  useEffect(() => {
    if (userPrincipal && !userPrincipal.isAnonymous()) {
      registerNewUser();

      // ic
      if (!IS_LOCAL_NETWORK) {
        const timeoutId = setTimeout(
          async () => await refreshBalance(),
          4 * 1000,
        );
        return () => clearTimeout(timeoutId);
      }

      // local
      if (IS_LOCAL_NETWORK) {
        const timeoutId = setTimeout(
          async () => setBalance("1000.00"),
          4 * 1000,
        );
        return () => clearTimeout(timeoutId);
      }
    }
  }, [userPrincipal]);

  return (
    <AppStyled>
      <Nav
        balance={balance}
        setBalance={setBalance}
        setSelected={setSelected}
        mapIsLoaded={mapIsLoaded}
      />

      <Main>
        <Map selected={selected} setMapIsLoaded={setMapIsLoaded} />

        {/* users */}
        {/* <div>
          <h3 className="sectionTitle">registered users</h3>
          {users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li
                  style={
                    userId === user.id
                      ? { backgroundColor: "var(--underlay1)" }
                      : null
                  }
                  key={user.id}
                >
                  {user.id}
                </li>
              ))}
            </ul>
          ) : (
            "..."
          )}
        </div> */}
      </Main>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  /* padding: 0 1rem; */
  /* margin-bottom: 4rem; */
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 auto;
`;

export default App;
