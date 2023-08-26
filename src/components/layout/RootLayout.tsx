import { FC } from "react";
import { styled } from "styled-components";
import { Outlet } from "react-router-dom";

// components
import { Nav } from "./_index";

const RootLayout: FC = (): JSX.Element => {
  return (
    <div>
      <Nav />

      <Main>
        <Outlet />
      </Main>
    </div>
  );
};

const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 auto;
`;

export default RootLayout;
