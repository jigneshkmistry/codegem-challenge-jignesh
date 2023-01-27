import {Emoji} from "./emoji";
import React, {useEffect, useState} from "react";
import {Tooltip} from "./tooltip";
import {capitalizeFirst} from "../utils/string";
import styled from "@emotion/styled";
import ApiService from '../services/api';

const EmojiSelectorStyled = styled.div`
  border-radius: 15px;
  border: ${props => props.error ? "2px solid rgba(255, 72, 72, 0.733)" : "1px solid rgba(0,0,0,0.1)"};
  padding: 20px;
  display: flex;
  margin: 10px 0;
  flex-wrap: wrap;

  ${Emoji} {
    font-size: 2em;
  }
`;

const EmojiContainer = styled.div`
  margin: 0 15px;
  position: relative;
`;

const EmojiDismiss = styled.span`
  position: absolute;
  top: -5px;
  right: -10px;
  cursor: pointer;
`;

const TooltipEmojiContainer = styled(EmojiContainer)`
  text-align: center;
  color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
`;

const TooltipContentWrapper = styled.div`
  border-radius: 15px;
  width: 240px;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TooltipContentHeader = styled.div`
  background-color: rgba(0, 0, 0, 0.02);
  padding: 10px 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const TooltipContentBody = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
`;

const TooltipContentEmojiWrapper = styled.div`
  margin: 0 10px;
  cursor: pointer;
  text-align: center;
`;

export const EmojiSelector = ({selected, setSelected, error}) => {
    let [hovered, setHovered] = useState();
    const [moods, setMoods] = useState([]);
    const [isMoodsLoaded, setIsMoodsLoaded] = useState(false);

    useEffect(() => {
        let isMounted = true;
        if (!isMoodsLoaded) {
            ApiService.get('/moods')
                .then(res => {
                    if (isMounted) {
                        setMoods(res.data);
                        setIsMoodsLoaded(true);
                    }
                })
                .catch(() => {
                    if (isMounted) {
                        alert('Could not load moods!');
                        setIsMoodsLoaded(true);
                    }
                });
        }
        return () => isMounted = false;

    }, [isMoodsLoaded]);

    const removeMood = (mood) => {
        let idx = selected.indexOf(mood);
        selected.splice(idx, 1);
        setSelected([...selected]);
    };

    const addMood = (mood) => {
        if (selected.indexOf(mood) < 0) {
            selected.push(mood);
            setSelected([...selected]);
        }
    };

    const onHover = emoji => setHovered(emoji);

    return (
        <EmojiSelectorStyled error={error}>
            {selected && selected.map(mood => (
                <EmojiContainer key={mood.id}>
                    <EmojiDismiss onClick={() => removeMood(mood)}>{"\u00d7"}</EmojiDismiss>
                    <Emoji emoji={mood.emoji}/>
                </EmojiContainer>))}
            <Tooltip
                offset={"-165px"}
                target={<TooltipEmojiContainer>
                    <span style={{fontSize: "1.3em"}}>{"\u2795"}</span><br/>
                    <span style={{fontSize: "0.7em"}}>add mood</span>
                </TooltipEmojiContainer>}
                content={<TooltipContentWrapper>
                    <TooltipContentHeader>
                        {hovered ? `${capitalizeFirst(hovered)}` : 'Mood'}
                    </TooltipContentHeader>
                    <TooltipContentBody>
                        {moods.map(mood => (
                            <TooltipContentEmojiWrapper
                                key={mood.id}
                                onClick={() => addMood(mood)}
                                onMouseOut={() => onHover(null)}
                                onMouseOver={() => onHover(mood.emoji_name)}>
                                <Emoji emoji={mood.emoji}/>
                            </TooltipContentEmojiWrapper>))}
                    </TooltipContentBody>
                </TooltipContentWrapper>}/>
        </EmojiSelectorStyled>
    );
};
