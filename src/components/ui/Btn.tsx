import { FC, ButtonHTMLAttributes } from "react";
import styled from "styled-components";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  $btntype: "primary" | "secondary";
  text: string;
  onClick: () => void;
}

const Btn: FC<BtnProps> = ({
  $btntype,
  text,
  onClick,
  ...props
}): JSX.Element => {
  return (
    <BtnStyled $btntype={$btntype} onClick={onClick} {...props}>
      {text}
    </BtnStyled>
  );
};

const colors = {
  primary: "#fff",
  secondary: "var(--primaryColor)",
};

const bgColors = {
  primary: "var(--primaryColor)",
  secondary: "var(--underlay1)",
};

const hoverBgColors = {
  primary: "var(--secondaryColor)",
  secondary: "var(--underlay2)",
};

const BtnStyled = styled.button<{ $btntype: "primary" | "secondary" }>`
  /* common */
  height: 2.5rem;
  padding: 0 1rem;
  font-size: var(--fs6);
  font-weight: var(--fwSemiBold);
  transition: all 0.25s, opacity 1s;

  /* custom */
  color: ${(p) => colors[p.$btntype]};
  background-color: ${(p) => bgColors[p.$btntype]};

  &:hover {
    background-color: ${(p) => hoverBgColors[p.$btntype]};
  }
`;

export default Btn;
