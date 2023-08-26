import { FC } from "react";
import { styled } from "styled-components";

// auth
import { useAuth } from "../context/Auth";

// state
import { useAppSelector } from "../hooks/useRedux";
import { selectUsers } from "../state/users";

const Users: FC = (): JSX.Element => {
  const { userPrincipal } = useAuth();
  const users = useAppSelector(selectUsers);
  const userId = userPrincipal && userPrincipal.toString();

  return (
    <UsersStyled>
      <h2 className="sectionTitle">registered users</h2>
      <div>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li
                style={
                  userId === user.id
                    ? { backgroundColor: "var(--underlay1)" }
                    : null
                }
                key={user.id}
              >
                {user.id}
              </li>
            ))}
          </ul>
        ) : (
          "..."
        )}
      </div>
    </UsersStyled>
  );
};

const UsersStyled = styled.div`
  padding: 0.5rem;
`;

export default Users;
