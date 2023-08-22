import { useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";
import { backend } from "./declarations/backend";

// auth
import { useAuth } from "./context/Auth";

// components
import { Nav } from "./components/layout/_index";

interface User {
  id: string;
}

function App() {
  const { isAuthenticated, identity, login, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const addUser = async (): Promise<void> => {
      if (identity) {
        const userId = identity.getPrincipal().toString();
        await backend.addUser(userId);
        await refreshUsers();
      }
    };
    addUser();
  }, [identity]);

  const refreshUsers = async (): Promise<void> => {
    const users = await backend.getUsers();
    setUsers(users);
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  return (
    <div className="App">
      <Nav />

      <h3>users</h3>
      <Users>
        {users.map((user, i) => (
          <li key={user.id}>
            <code>
              {i + 1}: {user.id}
            </code>
          </li>
        ))}
      </Users>
    </div>
  );
}

const Users = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

export default App;
