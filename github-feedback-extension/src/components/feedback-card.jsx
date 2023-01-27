import styled from "@emotion/styled";
import React from "react";
import {Colors} from "../utils/colors";
import {FeedbackSummary} from "./feedback-summary";

const FeedbackDetails = styled.div`
  padding: 10px;
`;

const MiniChip = styled.div`
  margin-right: 4px;
  margin-top: 4px;
  background-color: ${Colors.primary};
  color: white;
  padding: 4px 8px;
  border-radius: 40px;
  font-size: 12px;
`;

const MiniChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const FeedbackCardComponent = ({feedback, className}) =>
    <div className={className}>
        <FeedbackSummary feedback={feedback}/>
        <FeedbackDetails>
            <div>{feedback.feedback}</div>
            {
                feedback.tags.length > 0 &&
                <MiniChipsContainer>
                    {feedback.tags.map(t => <MiniChip key={t.id}>{t.tag_name}</MiniChip>)}
                </MiniChipsContainer>
            }
        </FeedbackDetails>
    </div>;

export const FeedbackCard = styled(FeedbackCardComponent)`
  box-shadow: 0 1px 5px 0 #C8D3E8BF;
  border-radius: 8px;
  margin-top: 8px;
  background-color: #F7FAFF;
`;
