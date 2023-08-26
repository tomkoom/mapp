import { FC } from "react";
import { styled } from "styled-components";

// state
import { useAppSelector } from "../hooks/useRedux";
import { selectProposals } from "../state/proposals";

const Proposals: FC = (): JSX.Element => {
  const proposals = useAppSelector(selectProposals);

  return (
    <ProposalsStyled>
      <h2 className="sectionTitle">proposals</h2>

      {proposals.length > 0 ? (
        <List>
          {proposals.map((proposal: any) => (
            <li key={"proposal-id-" + String(proposal.id)}>
              <span>id: {proposal.id}</span>
              <span>ts: {proposal.timestamp}</span>
              <span>proposer: {proposal.proposer}</span>
              <span>votes yes: {JSON.stringify(proposal.votes_yes)}</span>
              <span>votes no: {JSON.stringify(proposal.votes_no)}</span>
            </li>
          ))}
        </List>
      ) : (
        "..."
      )}
    </ProposalsStyled>
  );
};

const ProposalsStyled = styled.div`
  padding: 0.5rem;
`;

const List = styled.ul`
  > li {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export default Proposals;
