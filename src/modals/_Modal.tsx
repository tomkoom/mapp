import { FC, ReactNode } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

// icons
import CrossIcon from "../components/icons/CrossIcon";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }): JSX.Element => {
  if (!isOpen) return null;

  return createPortal(
    <ModalStyled>
      <div>
        <CrossIcon onClick={onClose} />
        {children}
      </div>
    </ModalStyled>,
    document.getElementById("modal"),
  );
};

export const ModalStyled = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  /* z-index: 1; */
  background-color: var(--background);
  padding: 1rem;
`;

export default Modal;
