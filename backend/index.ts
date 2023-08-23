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
} from "azle";
import {
  ICRC1Account,
  ICRC,
  ICRC1TransferArgs,
  ICRC1TransferError,
  ICRC1Value,
} from "azle/canisters/icrc";

type Db = {
  users: {
    [id: string]: User;
  };
};

type User = Record<{
  id: string;
}>;

let db: Db = {
  users: {},
};

$query;
export function getUserById(id: string): Opt<User> {
  const userOrUndefined = db.users[id];

  return userOrUndefined ? Opt.Some(userOrUndefined) : Opt.None;
}

$query;
export function getUsers(): Vec<User> {
  return Object.values(db.users);
}

$update;
export function addUser(id: string): Opt<User> {
  if (Principal.fromText(id).isAnonymous()) return Opt.None;

  const user = {
    id,
  };
  db.users[id] = user;
  return Opt.Some(user);
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

// const icrc = new ICRC(
//   Principal.fromText(
//     process.env.ICRC_PRINCIPAL ??
//       ic.trap("process.env.ICRC_PRINCIPAL is undefined"),
//   ),
// );
