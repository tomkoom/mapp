import { FC, ButtonHTMLAttributes } from "react";
import styled from "styled-components";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  btnType: "primary" | "secondary";
  text: string;
  onClick: () => void;
}

const Btn: FC<BtnProps> = ({
  btnType,
  text,
  onClick,
  ...props
}): JSX.Element => {
  return (
    <BtnStyled btnType={btnType} onClick={onClick} {...props}>
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

const BtnStyled = styled.button<{ btnType: "primary" | "secondary" }>`
  /* common */
  height: 2.5rem;
  padding: 0 1rem;
  font-size: var(--fs6);
  font-weight: var(--fwSemiBold);
  transition: all 0.25s, opacity 1s;

  /* custom */
  color: ${(p) => colors[p.btnType]};
  background-color: ${(p) => bgColors[p.btnType]};

  &:hover {
    background-color: ${(p) => hoverBgColors[p.btnType]};
  }
`;

export default Btn;
