import { FC } from "react";
import styled from "styled-components";

// utils
import { formatId } from "../../utils/formatId";

// auth
import { useAuth } from "../../context/Auth";

// hooks
import useBackend from "../../hooks/useBackend";

// shared
import { signOut } from "../../shared/shared";

// components
import { Btn } from "../ui/_index";
import { AddPointModal } from "../../modals/_index";

// router
import { NavLink } from "react-router-dom";

// state
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { selectUserBalance } from "../../state/user";
import {
  selectAddPointModalIsOpen,
  setAddPointModalIsOpen,
} from "../../state/modals/addPointModal";

const Nav: FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, userPrincipal, login, logout, actor } = useAuth();
  const { refreshProposals } = useBackend();
  const balance = useAppSelector(selectUserBalance);
  const userId = userPrincipal && userPrincipal.toString();
  const isOpen = useAppSelector(selectAddPointModalIsOpen);
  const about =
    "https://tomkoom.notion.site/about-mapp-21fa0313cea846df9f1fcea76be4b28b?pvs=25";
  const tokenInterface =
    "https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/?id=6jhti-pyaaa-aaaag-abnwa-cai";
  const active = {
    color: "var(--primaryColor)",
  };

  const openModal = () => {
    dispatch(setAddPointModalIsOpen(true));
  };

  const closeModal = () => {
    dispatch(setAddPointModalIsOpen(false));
  };

  const addProposal = async (): Promise<void> => {
    if (isAuthenticated) {
      await actor
        .addProposal({
          position: { lat: 0, lng: 0 },
          description: "123",
        })
        .then((res) => console.log(res));
      await refreshProposals();
    } else {
      console.log("user is not auth");
    }
  };

  return (
    <NavStyled>
      {/* modal */}
      <AddPointModal isOpen={isOpen} onClose={closeModal} />

      <div id="title">
        <Logo to="/">
          <h1>mapp</h1>
        </Logo>
        {/* <span>- collaborative map</span> */}

        <Routes>
          <NavLink to="/" style={({ isActive }) => (isActive ? active : null)}>
            MAP
          </NavLink>
          <NavLink
            to="/proposals"
            style={({ isActive }) => (isActive ? active : null)}
          >
            PROPOSALS
          </NavLink>
          <NavLink
            to="/users"
            style={({ isActive }) => (isActive ? active : null)}
          >
            USERS
          </NavLink>
          <a href={about} target="_blank" rel="noreferrer noopener">
            ABOUT
          </a>
        </Routes>
      </div>

      <NavItems>
        <a href={tokenInterface} target="_blank" rel="noreferrer noopener">
          Token
        </a>

        <div id="balance">
          Balance: <span>{balance ? balance : "..."}</span>
        </div>

        <Btns>
          {isAuthenticated && (
            <Btn $btntype="primary" text="Add Point" onClick={openModal} />
          )}

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
            <Btn $btntype="primary" text="Login" onClick={login} />
          )}
        </Btns>
      </NavItems>
    </NavStyled>
  );
};

const NavStyled = styled.div`
  width: 100%;
  height: 4rem;
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

const Logo = styled(NavLink)`
  text-decoration: none;

  > h1 {
    font-size: var(--fs5);
    font-weight: var(--fwBlack);
    padding-bottom: 0.2rem;
    margin-right: 1rem;
  }
`;

const Routes = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  > a {
    color: var(--tertiaryColor);
    font-weight: var(--fwMedium);
    font-size: var(--fs5);
    text-decoration: none;
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
