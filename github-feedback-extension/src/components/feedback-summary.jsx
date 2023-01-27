import React from "react";
import styled from "@emotion/styled";
import {emojiAndColorForSentiment, textForSentiment} from "../utils/sentiments";
import {format} from "date-fns";

const SentimentHighlight = styled.div`
  background-color: ${props => props.sentimentColor};
  padding: 12px 18px;
  border-top-left-radius: 8px;
  font-size: 32px;
`;

const SummaryDiv = styled.div`
  padding: 6px 12px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  background-color: white;

  border-top-right-radius: 8px;
`;

const SummaryText = styled.div`
  font-size: 18px;
  color: ${props => props.color}
`;

const SummaryTime = styled.div`
    font-size: 14px;
`;

const Emoji = styled.span`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin-right: 4px;
  padding: 8px;
  border-radius: 4px;
  background-color: #FBFCFC;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
  min-width: 40px;
`;

const EmojiName = styled.div`
  font-size: 10px;
  font-family: "Roboto Light", sans-serif;
  font-weight: 200;
  text-transform: capitalize;
`;

const EmojiContainer = styled.div`
  display: flex;
  align-items: center;
`;

const RemainingCount = styled.span`
  font-size: 10px;
  border-radius: 50%;
  background-color: #FBFCFC;
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
  padding: 4px;
`;

const Summary = ({feedback, sentimentValue}) => {
    const {color} = emojiAndColorForSentiment(sentimentValue);
    const text = textForSentiment(sentimentValue);

    // First 2 moods
    const moods = feedback.moods.slice(0, 2);
    const remainingMoods = feedback.moods.length - 2;

    return <SummaryDiv>
        <div>
            <SummaryText color={color}>{text}</SummaryText>
            <SummaryTime>{format(feedback.created_at, 'h:mm bbb')}</SummaryTime>
        </div>
        <EmojiContainer>
            {moods.map((m) => <Emoji key={m.id}>
                {m.emoji}
                <EmojiName>{m.emoji_name}</EmojiName>
            </Emoji>)}
            {remainingMoods > 0 && <RemainingCount>{`+${remainingMoods}`}</RemainingCount>}
        </EmojiContainer>
    </SummaryDiv>;
};

function bucketedSentimentValue(value) {
    return Math.min(Math.max(Math.round(value), 1), 5);
}

const FeedbackSummaryComponent = ({className, feedback}) => {
    const sentimentValue = bucketedSentimentValue(parseFloat(feedback.average_sentiment));
    const {color, emoji} = emojiAndColorForSentiment(sentimentValue);

    return <div className={className}>
        <SentimentHighlight sentimentColor={color}>
            {emoji}
        </SentimentHighlight>
        <Summary feedback={feedback} sentimentValue={sentimentValue}/>
    </div>;
};

export const FeedbackSummary = styled(FeedbackSummaryComponent)`
  display: flex;
  width: 100%;
  box-shadow: 0 2px 6px 2px #C8D3E833;
`;
