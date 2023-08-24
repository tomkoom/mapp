import { useState, useEffect } from "react";
import { backend } from "../declarations/backend";

interface User {
  id: string;
}

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  const refreshUsers = async (): Promise<void> => {
    const users = await backend.getUsers();
    setUsers(users);
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  return { users, refreshUsers };
};

export default useUsers;
