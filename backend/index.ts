import {
  ic,
  $query,
  $update,
  Opt,
  Vec,
  Principal,
  Tuple,
  text,
  match,
  StableBTreeMap,
  Variant,
  nat,
} from "azle";

import {
  ICRC1Account,
  ICRC,
  ICRC1TransferArgs,
  ICRC1TransferError,
  ICRC1Value,
} from "azle/canisters/icrc";

import type { User, ProposalId, Proposal, ProposalPayload } from "./types";

// maps
const users = new StableBTreeMap<Principal, User>(0, 100, 1_000);
const proposals = new StableBTreeMap<ProposalId, Proposal>(1, 100, 2_000);

$query;
export function getUserById(id: Principal): Opt<User> {
  return users.get(id);
}

$query;
export function userExists(id: Principal): boolean {
  return users.containsKey(id);
}

$update;
export function addUser(id: Principal): Opt<User> {
  if (id.isAnonymous()) {
    return Opt.None;
  }

  const user = { id: id.toText() };
  return users.insert(id, user);
}

$query;
export function getUsers(): Vec<User> {
  return users.values();
}

// token
const tokenCanister = "6jhti-pyaaa-aaaag-abnwa-cai";
const icrc = new ICRC(Principal.fromText(tokenCanister));

$query;
export async function icrc1_metadata(): Promise<
  Vec<Tuple<[text, ICRC1Value]>>
> {
  const result = await icrc.icrc1_metadata().call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

$update;
export async function icrc1_transfer(
  transferArgs: ICRC1TransferArgs,
): Promise<Variant<{ Ok: nat; Err: ICRC1TransferError }>> {
  const result = await icrc.icrc1_transfer(transferArgs).call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

$query;
export async function icrc1_balance_of(account: ICRC1Account): Promise<nat> {
  const result = await icrc.icrc1_balance_of(account).call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

// proposals
$update;
export function addProposal(payload: ProposalPayload): Opt<Proposal> {
  if (ic.id().isAnonymous()) {
    return Opt.None;
  }

  const id = proposals.len();
  const proposal = {
    id: id,
    timestamp: ic.time(),
    votes_yes: { amount_e8s: 0n },
    votes_no: { amount_e8s: 0n },
    voters: [],
    proposer: ic.caller(),
    state: { Open: null },
    payload: payload,
  };

  console.log(proposal);
  return proposals.insert(id, proposal);
}

$query;
export function getProposals(): Vec<Proposal> {
  return proposals.values();
}

$update;
export function vote(id: nat, amount: nat, value: string): Opt<Proposal> {
  return match(proposals.get(id), {
    Some: (proposal) => {
      switch (value) {
        case "yes":
          const yesVotesAmount = proposal.votes_yes.amount_e8s;
          proposals.insert(id, {
            ...proposal,
            votes_yes: {
              amount_e8s: yesVotesAmount + amount,
            },
          });

          break;
        case "no":
          const noVotesAmount = proposal.votes_no.amount_e8s;
          proposals.insert(id, {
            ...proposal,
            votes_no: {
              amount_e8s: noVotesAmount + amount,
            },
          });

          break;
      }
      return Opt.Some(proposal);
    },
    None: () => Opt.None,
  });
}
