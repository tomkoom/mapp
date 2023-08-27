import { useEffect } from "react";
import type { Principal } from "@dfinity/principal";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// auth
import { useAuth } from "./context/Auth";

// hooks
import useBackend from "./hooks/useBackend";

// components
import { RootLayout } from "./components/layout/_index";
import { Map, Proposals, Users } from "./pages/_index";

// state
import { useAppDispatch } from "./hooks/useRedux";
import { setUserBalance, setUserBalanceE8S } from "./state/user";

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
const NETWORK = process.env.DFX_NETWORK;

function App() {
  const dispatch = useAppDispatch();
  const { userPrincipal, isAuthenticated, actor } = useAuth();
  const { refreshUsers, refreshProposals } = useBackend();

  useEffect(() => {
    if (actor) {
      refreshUsers();
      refreshProposals();
    }
  }, [actor]);

  const userExists = async (): Promise<boolean> => {
    const exists = await actor.userExists(userPrincipal);
    console.log(exists ? "user exists" : "user is new");
    return exists;
  };

  const addUser = async (userPrincipal: Principal): Promise<void> => {
    await actor.addUser(userPrincipal);
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

    await actor
      .icrc1_transfer(transferArgs)
      .then(() => console.log("tokens sent"));
  };

  const refreshBalance = async (): Promise<void> => {
    const account: ICRC1Account = { owner: userPrincipal, subaccount: [] };
    await actor.icrc1_balance_of(account).then((res) => {
      if (res) {
        dispatch(setUserBalance((Number(res) / 10 ** 8).toFixed(2)));
        dispatch(setUserBalanceE8S(Number(res)));
        console.log("balance refreshed");
      }
    });
  };

  const refreshBalanceLocal = () => {
    dispatch(setUserBalance("1000.00"));
    dispatch(setUserBalanceE8S(Number(1000 * 10 ** 8)));
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (NETWORK === "ic") {
        refreshBalance();
      }

      if (NETWORK === "local") {
        refreshBalanceLocal;
      }
    }
  }, [isAuthenticated]);

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
    if (isAuthenticated) {
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
        const timeoutId = setTimeout(refreshBalanceLocal, 4 * 1000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [isAuthenticated]);

  return <RouterProvider router={router} />;
}

export default App;
