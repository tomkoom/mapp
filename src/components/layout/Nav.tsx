import { FC, Dispatch, SetStateAction } from "react";
import styled from "styled-components";

// utils
import { formatId } from "../../utils/formatId";

// components
import { Btn } from "../ui/_index";

// auth
import { useAuth } from "../../context/Auth";

interface NavProps {
  balance: string;
  setBalance: Dispatch<SetStateAction<string>>;
}

const Nav: FC<NavProps> = ({ balance, setBalance }): JSX.Element => {
  const { isAuthenticated, identity, login, logout } = useAuth();
  const id = identity && identity.getPrincipal().toString();

  const signOut = async () => {
    setBalance("");
    await logout();
  };

  return (
    <NavStyled>
      <div id="title">
        <h1>mapp</h1>
        <span>&ndash; collaborative map curation</span>
      </div>

      <a
        href="https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/?id=6jhti-pyaaa-aaaag-abnwa-cai"
        target="_blank"
        rel="noreferrer noopener"
      >
        Token interface
      </a>

      <div id="balance">
        Balance: <span>{balance ? balance : "..."}</span>
      </div>

      {isAuthenticated ? (
        <LoggedIn>
          <span>{formatId(id)}</span>
          <Btn $btntype="secondary" text="Logout" onClick={signOut} />
        </LoggedIn>
      ) : (
        <Btn $btntype="primary" text="Login" onClick={login} />
      )}
    </NavStyled>
  );
};

const NavStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;

  > div#title {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.25rem;

    > h1 {
      font-size: var(--fs4);
      font-weight: var(--fwBlack);
      padding-bottom: 0.25rem;
    }

    > span {
      padding: 0.5rem;
    }
  }

  > a {
    margin-left: auto;
    margin-right: 0.5rem;
  }

  > div#balance {
    padding: 0.5rem;
    margin-right: 0.5rem;
  }
`;

const LoggedIn = styled.div`
  > span {
    margin-right: 1rem;
  }
`;

export default Nav;
