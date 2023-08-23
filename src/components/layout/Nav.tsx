import { FC } from "react";
import styled from "styled-components";

// utils
import { formatId } from "../../utils/formatId";

// auth
import { useAuth } from "../../context/Auth";

const Nav: FC = (): JSX.Element => {
  const { isAuthenticated, identity, login, logout } = useAuth();
  const id = identity && identity.getPrincipal().toString();

  return (
    <NavStyled>
      <h1>dao</h1>
      {isAuthenticated ? (
        <LoggedIn>
          <span>{formatId(id)}</span>
          <button onClick={logout}>logout</button>
        </LoggedIn>
      ) : (
        <button onClick={login}>login</button>
      )}
    </NavStyled>
  );
};

const NavStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;

const LoggedIn = styled.div`
  > span {
    margin-right: 1rem;
  }
`;

export default Nav;
