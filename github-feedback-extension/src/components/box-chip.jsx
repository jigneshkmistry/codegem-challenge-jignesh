import styled from "@emotion/styled";
import React from "react";

const Title = styled.div`
    font-size: 12px;
    line-height: 14px;
    font-family: 'Roboto-Thin', sans-serif;
    font-weight: 300;
`;

const Text = styled.div`
  margin-top: 8px;
  font-family: 'Roboto-Bold', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
`;

const BoxChipComponent = ({ title, text, className }) => {
    return (
        <div className={className} >
            <Title>{title}</Title>
            <Text>{text}</Text>
        </div>
    );
};

export const BoxChip = styled(BoxChipComponent)`
    padding: 10px 12px;
    border-radius: 8px;
    background-color: ${props => props.color};
    color: white;
`;
