import {
  ic,
  $query,
  $update,
  Opt,
  Record,
  Vec,
  Principal,
  Tuple,
  text,
  match,
  StableBTreeMap,
} from "azle";
import {
  ICRC1Account,
  ICRC,
  ICRC1TransferArgs,
  ICRC1TransferError,
  ICRC1Value,
} from "azle/canisters/icrc";

type User = Record<{
  id: string;
}>;

// map
const users = new StableBTreeMap<Principal, User>(0, 100, 1_000);

$query;
export function getUserById(id: Principal): Opt<User> {
  return users.get(id);
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
