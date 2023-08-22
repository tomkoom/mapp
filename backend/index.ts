import { $query, $update, Opt, Record, Vec, Principal } from "azle";

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
