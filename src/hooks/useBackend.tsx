import { Proposal, User } from "../declarations/backend/backend.did";

// auth
import { useAuth } from "../context/Auth";

// state
import { useAppDispatch } from "./useRedux";
import { setProposals } from "../state/proposals";
import { setUsers } from "../state/users";

const useBackend = () => {
  const dispatch = useAppDispatch();
  const { actor } = useAuth();

  const refreshUsers = async (): Promise<void> => {
    if (actor) {
      const users: User[] = await actor.getUsers();
      dispatch(setUsers(users));
    }
  };

  const refreshProposals = async (): Promise<void> => {
    if (actor) {
      const formatted = [];
      await actor.getProposals().then((proposals: Proposal[]) => {
        proposals.forEach((p) => {
          const item = {
            ...p,
            id: String(p.id),
            voters: p.voters.map((voter) => voter.toString()),
            timestamp: Number(p.timestamp),
            proposer: p.proposer.toString(),
            votes_yes_e8s: Number(p.votes_yes_e8s),
            votes_no_e8s: Number(p.votes_no_e8s),
          };
          formatted.push(item);
        });
      });
      dispatch(setProposals(formatted));
    }
  };

  return { refreshUsers, refreshProposals };
};

export default useBackend;
