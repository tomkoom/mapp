import { backend } from "../declarations/backend";
import { store } from "../state/_store";
import { setUsers } from "../state/users";
import type { Proposal, User } from "../declarations/backend/backend.did";
import { setUserBalance } from "../state/user";
import { setProposals } from "../state/proposals";

export const signIn = async (login: () => Promise<void>): Promise<void> => {
  await login();
};

export const signOut = async (logout: () => Promise<void>): Promise<void> => {
  store.dispatch(setUserBalance(""));
  await logout();
};

export const refreshUsers = async (): Promise<void> => {
  const users: User[] = await backend.getUsers();
  store.dispatch(setUsers(users));
};

export const refreshProposals = async (): Promise<void> => {
  const formatted = [];
  await backend.getProposals().then((proposals: Proposal[]) => {
    proposals.forEach((p) => {
      const item = {
        ...p,
        id: String(p.id),
        voters: p.voters.map((voter) => voter.toString()),
        timestamp: Number(p.timestamp),
        proposer: p.proposer.toString(),
        votes_yes: String(p.votes_yes.amount_e8s),
        votes_no: String(p.votes_no.amount_e8s),
      };
      formatted.push(item);
    });
  });

  store.dispatch(setProposals(formatted));
};
