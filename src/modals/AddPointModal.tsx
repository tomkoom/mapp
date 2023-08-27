import { FC, useState } from "react";
import styled from "styled-components";

// router
import { useNavigate } from "react-router-dom";

// hooks
import useBackend from "../hooks/useBackend";

// auth
import { useAuth } from "../context/Auth";

// components
import { AutocompleteInput, Btn } from "../components/ui/_index";
import CrossIcon from "../components/icons/CrossIcon";

// state
import { useAppSelector } from "../hooks/useRedux";
import { selectMapIsLoaded, selectMapPosition } from "../state/map";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPointModal: FC<ModalProps> = ({ isOpen, onClose }): JSX.Element => {
  if (!isOpen) return null;
  const navigate = useNavigate();
  const { isAuthenticated, actor } = useAuth();
  const { refreshProposals } = useBackend();

  const [description, setDescription] = useState<string>("");
  const mapIsLoaded = useAppSelector(selectMapIsLoaded);
  const position = useAppSelector(selectMapPosition);

  const addProposal = async (): Promise<void> => {
    if (isAuthenticated) {
      await actor
        .addProposal({
          position,
          description,
        })
        .then((res) => console.log(res));
      await refreshProposals();
      onClose();
      navigate("/proposals");
    } else {
      console.log("user is not auth");
    }
  };

  return (
    <ModalStyled>
      <Content>
        {/* <CrossIcon onClick={onClose} /> */}
        <h3>Add Point</h3>
        <p>
          Submit new point to the map as a proposal
          {/* The mark will apear on the
          map instantly, there will be a short period of time for the map
          curators &#40;dapp token holders&#41; to approve or decline point */}
        </p>

        <InputField>
          <label htmlFor="description">Position</label>
          <AutocompleteInput mapIsLoaded={mapIsLoaded} />
        </InputField>

        <InputField>
          <label htmlFor="description">Short description</label>
          <input
            id="description"
            type="text"
            placeholder="e.g. crypto meetup in this place on the 1-st of September 2023"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </InputField>

        <Btns>
          <Btn $btntype="secondary" text="Cancel" onClick={onClose} />
          <Btn $btntype="primary" text="Submit" onClick={addProposal} />
        </Btns>
      </Content>
    </ModalStyled>
  );
};

const ModalStyled = styled.div`
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: var(--background);
  padding: 1rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;

  > h3 {
    font-size: var(--fs5);
    line-height: 125%;
  }
`;

const InputField = styled.div`
  width: 100%;
  > input {
    height: 2.25rem;
    width: 100%;
    font-size: var(--fsText);
    padding: 0 0.75rem;
    box-sizing: border-box;
  }
`;

const Btns = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export default AddPointModal;
