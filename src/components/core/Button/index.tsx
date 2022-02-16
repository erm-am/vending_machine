import React from "react";
import styled, { css } from "styled-components";
interface IButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<IButtonProps> = (props) => {
  const { onClick, children, disabled = false, className } = props;
  const handleClick = () => {
    if (!disabled) onClick();
  };
  return (
    <ButtonContainer className={className} disabled={disabled} onClick={handleClick}>
      {children}
    </ButtonContainer>
  );
};

const ButtonContainer = styled.button<{ disabled: boolean }>`
  cursor: pointer;
  min-width: 15px;
  min-height: 15px;
  border: none;
  color: black;
  border-radius: 5px;
  background: #ffcc00;
  font-size: 16px;
  margin: 4px;
  ${(props) =>
    props.disabled &&
    css`
      background: gray;
      color: black;
    `}
`;
