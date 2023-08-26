import { FC } from "react";
import styled from "styled-components";
import { backend } from "../../declarations/backend";

// utils
import { formatId } from "../../utils/formatId";

// auth
import { useAuth } from "../../context/Auth";

// shared
import { signOut } from "../../shared/shared";

// components
import { Btn } from "../ui/_index";

// router
import { Link } from "react-router-dom";

// state
import { useAppSelector } from "../../hooks/useRedux";
import { selectUserBalance } from "../../state/user";

const Nav: FC = (): JSX.Element => {
  const { isAuthenticated, userPrincipal, login, logout } = useAuth();
  const balance = useAppSelector(selectUserBalance);
  const userId = userPrincipal && userPrincipal.toString();

  const addProposal = async (): Promise<void> => {
    if (!userPrincipal.isAnonymous()) {
      await backend
        .addProposal({
          position: { lat: 0, lng: 0 },
          description: "123",
        })
        .then((res) => console.log(res));
    }
    console.log("anonymous users can't submit proposals");
  };

  const getProposals = async (): Promise<void> => {
    const res = await backend.getProposals().then((res) => console.log(res));
  };

  return (
    <NavStyled>
      <div id="title">
        <Logo to="/">
          <h1>mapp</h1>
        </Logo>
        {/* <span>- collaboratively curated map</span> */}
      </div>

      <NavItems>
        <Link to="/">Map</Link>
        <Link to="/proposals">Proposals</Link>
        <Link to="/users">Users</Link>

        <a
          href="https://tomkoom.notion.site/about-mapp-21fa0313cea846df9f1fcea76be4b28b?pvs=25"
          target="_blank"
          rel="noreferrer noopener"
        >
          About
        </a>

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

        <Btns>
          <Btn $btntype="primary" text="add point" onClick={addProposal} />
          <Btn $btntype="primary" text="get" onClick={getProposals} />
          {isAuthenticated ? (
            <LoggedIn>
              <span>{formatId(userId)}</span>
              <Btn
                $btntype="secondary"
                text="Logout"
                onClick={() => signOut(logout)}
              />
            </LoggedIn>
          ) : (
            <Btn $btntype="secondary" text="Login" onClick={login} />
          )}
        </Btns>
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

    > span {
      margin-left: 0.25rem;
    }
  }
`;

const Logo = styled(Link)`
  text-decoration: none;

  > h1 {
    font-size: var(--fs5);
    font-weight: var(--fwBlack);
    padding-bottom: 0.2rem;
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

const Btns = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.5rem;
`;

const LoggedIn = styled.div`
  > span {
    margin-right: 1rem;
  }
`;

export default Nav;
