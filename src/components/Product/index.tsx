import React from "react";
import styled, { css } from "styled-components";
import { Blocker } from "../core/Blocker";
interface IProductProps {
  disabled?: boolean;
}

export const Product: React.FC<IProductProps> = (props) => {
  const { children, disabled } = props;

  return (
    <ProductContainer disabled={disabled}>
      {disabled && <Blocker />}
      {children}
    </ProductContainer>
  );
};

const ProductContainer = styled.div<{ disabled: boolean }>`
  position: relative;
  border: 1px solid #000000;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  ${(props) =>
    props.disabled &&
    css`
      color: gray;
      border-color: gray;
    `}
`;
