import { FC, useState } from "react";
import { styled } from "styled-components";
import { VoteArgs } from "../declarations/backend/backend.did";

// hooks
import useBackend from "../hooks/useBackend";

// auth
import { useAuth } from "../context/Auth";

// components
import { Btn } from "../components/ui/_index";

// state
import { useAppSelector } from "../hooks/useRedux";
import { selectProposals } from "../state/proposals";
import { selectUserBalanceE8S } from "../state/user";

const Proposals: FC = (): JSX.Element => {
  const { refreshProposals } = useBackend();
  const { actor, isAuthenticated } = useAuth();
  const [voteLoading, setVoteLoading] = useState<boolean>(false);
  const proposals = useAppSelector(selectProposals);
  const userBalanceE8S = useAppSelector(selectUserBalanceE8S);

  const vote = async (id: number, vote: string): Promise<void> => {
    if (isAuthenticated) {
      setVoteLoading(true);
      const voteArgs: VoteArgs = {
        id: BigInt(id),
        amount_e8s: BigInt(userBalanceE8S),
        vote,
      };
      await actor.vote(voteArgs);
      await refreshProposals();
      setVoteLoading(false);
    } else {
      console.log("user is not auth");
    }
  };

  const formatDate = (ts: number) => {
    const date = new Date(ts / 1000_000);
    const formatted =
      date.getHours() +
      ":" +
      date.getMinutes().toString().padStart(2, "0") +
      ", " +
      date.toDateString();
    return formatted;
  };

  return (
    <ProposalsStyled>
      <h2
        className="sectionTitle"
        onClick={async () => {
          refreshProposals();
        }}
      >
        proposals
      </h2>
      <p>
        for the testing purposes 2000 tokens are enough to accept or decline
        proposal
      </p>
      {proposals.length > 0 ? (
        <List>
          {[...proposals].reverse().map((proposal: any) => (
            <li key={"proposal-id-" + String(proposal.id)}>
              <span>
                proposal id: {proposal.id}
                <br />
                state {Object.keys(proposal.state)[0]}
              </span>
              <span>
                created at
                <br />
                {formatDate(proposal.timestamp)}
              </span>
              <span>
                proposer
                <br />
                {proposal.proposer}
              </span>
              <span>votes accept: {proposal.votes_yes_e8s}</span>
              <span>votes reject: {proposal.votes_no_e8s}</span>

              {isAuthenticated && (
                <span>
                  <Btn
                    $btntype="primary"
                    text="Accept"
                    onClick={() => vote(proposal.id, "yes")}
                    disabled={voteLoading}
                  />
                </span>
              )}

              {isAuthenticated && (
                <span>
                  <Btn
                    $btntype="primary"
                    text="Reject"
                    onClick={() => vote(proposal.id, "no")}
                    disabled={voteLoading}
                  />
                </span>
              )}
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
    margin-bottom: 0.5rem;
    padding: 1rem;
    background-color: var(--underlay1);

    > span {
      flex: 1;
    }
  }
`;

export default Proposals;
