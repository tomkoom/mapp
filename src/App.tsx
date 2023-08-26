import { useEffect } from "react";
import { backend } from "./declarations/backend";
import type { Principal } from "@dfinity/principal";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// auth
import { useAuth } from "./context/Auth";

// shared
import { refreshUsers, refreshProposals } from "./shared/shared";

// components
import { RootLayout } from "./components/layout/_index";
import { Map, Proposals, Users } from "./pages/_index";

// state
import { useAppDispatch } from "./hooks/useRedux";
import { setUserBalance } from "./state/user";

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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route
        path="*"
        element={
          <p style={{ textAlign: "center" }}>Requested page doesn't exist</p>
        }
      />
      <Route index element={<Map />} />
      <Route path="proposals" element={<Proposals />} />
      <Route path="users" element={<Users />} />
    </Route>,
  ),
);

const IS_LOCAL_NETWORK = process.env.DFX_NETWORK === "local";

function App() {
  const dispatch = useAppDispatch();
  const { userPrincipal } = useAuth();

  useEffect(() => {
    if (backend) {
      refreshUsers();
      refreshProposals();
    }
  }, [backend]);

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
    await backend.icrc1_balance_of(account).then((res) => {
      if (res) {
        dispatch(setUserBalance((Number(res) / 10 ** 8).toFixed(2)));
        console.log("balance refreshed");
      }
    });
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
          async () => dispatch(setUserBalance("1000.00")),
          4 * 1000,
        );
        return () => clearTimeout(timeoutId);
      }
    }
  }, [userPrincipal]);

  return <RouterProvider router={router} />;
}

export default App;
