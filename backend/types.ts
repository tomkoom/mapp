import {
  Record,
  Vec,
  Principal,
  text,
  Variant,
  nat,
  nat64,
  float32,
} from "azle";

export type User = Record<{
  id: string;
}>;

export type ProposalId = nat;
export type Tokens = Record<{ amount_e8s: nat }>;

export type ProposalPayload = Record<{
  position: Record<{ lat: float32; lng: float32 }>;
  description: string;
  // category: Variant<{}>;
}>;

export type Proposal = Record<{
  id: nat;
  timestamp: nat64;
  votes_yes: Tokens;
  votes_no: Tokens;

  voters: Vec<Principal>;
  state: ProposalState;
  proposer: Principal;
  payload: ProposalPayload;
}>;

export type ProposalState = Variant<{
  // A failure occurred while executing the proposal
  Failed: text;
  // The proposal is open for voting
  Open: null;
  // The proposal is currently being executed
  Executing: null;
  // Enough "no" votes have been cast to reject the proposal, and it will not be executed
  Rejected: null;
  // The proposal has been successfully executed
  Succeeded: null;
  // Enough "yes" votes have been cast to accept the proposal, and it will soon be executed
  Accepted: null;
}>;
