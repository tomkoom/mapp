import { FC } from "react";
import styled from "styled-components";

// utils
import { formatId } from "../../utils/formatId";

// components
import { Btn } from "../ui/_index";

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
          <Btn $btntype="secondary" text="logout" onClick={logout} />
        </LoggedIn>
      ) : (
        <Btn $btntype="primary" text="login" onClick={login} />
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
