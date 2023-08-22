import { FC } from "react";
import { styled } from "styled-components";

// auth
import { useAuth } from "../../context/Auth";

const Nav: FC = (): JSX.Element => {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <NavStyled>
      <h1>dao</h1>
      {isAuthenticated ? (
        <button onClick={logout}>logout</button>
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
`;

export default Nav;
