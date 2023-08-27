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
  Record,
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
const users = new StableBTreeMap<Principal, User>(0, 50, 500);
const proposals = new StableBTreeMap<ProposalId, Proposal>(1, 100, 1_000);

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
    votes_yes_e8s: 0n,
    votes_no_e8s: 0n,
    voters: [],
    proposer: ic.caller(),
    state: { Open: null },
    payload: payload,
  };
  return proposals.insert(id, proposal);
}

$query;
export function getProposals(): Vec<Proposal> {
  return proposals.values();
}

type VoteArgs = Record<{
  id: nat;
  amount_e8s: nat;
  vote: string;
}>;

$update;
export function vote(voteArgs: VoteArgs): Opt<Proposal> {
  if (ic.id().isAnonymous()) return Opt.None;

  const { id, amount_e8s, vote } = voteArgs;

  match(proposals.get(id), {
    Some: (some) => {
      if (vote === "yes") {
        proposals.insert(id, {
          ...some,
          votes_yes_e8s: some.votes_yes_e8s + amount_e8s,
        });
      }
      if (vote === "no") {
        proposals.insert(id, {
          ...some,
          votes_no_e8s: some.votes_no_e8s + amount_e8s,
        });
      }
    },
    None: () => Opt.None,
  });
  return Opt.None;
}
