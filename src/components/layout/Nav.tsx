import { FC, Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";

// utils
import { formatId } from "../../utils/formatId";

// components
import { Btn } from "../ui/_index";
import { AutocompleteInput } from "../../panels/map/_index";

// auth
import { useAuth } from "../../context/Auth";

interface NavProps {
  balance: string;
  setBalance: Dispatch<SetStateAction<string>>;
  setSelected: Dispatch<SetStateAction<google.maps.LatLngLiteral | null>>;
  mapIsLoaded: boolean;
}

const Nav: FC<NavProps> = ({
  balance,
  setBalance,
  setSelected,
  mapIsLoaded,
}): JSX.Element => {
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
        <span>- collaboratively curated map</span>
      </div>

      {mapIsLoaded && <AutocompleteInput setSelected={setSelected} />}

      <NavItems>
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
          <Btn $btntype="secondary" text="Login" onClick={login} />
        )}
      </NavItems>
    </NavStyled>
  );
};

const NavStyled = styled.div`
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem;

  > div#title {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    white-space: nowrap;
    margin-right: 0.5rem;
    gap: 0.125rem;

    > h1 {
      font-size: var(--fs5);
      font-weight: var(--fwBlack);
      padding-bottom: 0.2rem;
    }

    > span {
      margin-left: 0.25rem;
    }
  }
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;

  > a,
  > div#balance {
    font-size: var(--fsText);
    white-space: nowrap;
  }
`;

const LoggedIn = styled.div`
  > span {
    margin-right: 1rem;
  }
`;

export default Nav;
