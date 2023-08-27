import { store } from "../state/_store";
import { setUserBalance } from "../state/user";

export const signIn = async (login: () => Promise<void>): Promise<void> => {
  await login();
};

export const signOut = async (logout: () => Promise<void>): Promise<void> => {
  store.dispatch(setUserBalance(""));
  await logout();
};
