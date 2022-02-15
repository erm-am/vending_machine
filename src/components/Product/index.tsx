import React from "react";
import styled from "styled-components";
interface IProductProps {}

export const Product: React.FC<IProductProps> = (props) => {
  const { children } = props;

  return <ProductContainer>{children}</ProductContainer>;
};

const ProductContainer = styled.div`
  border: 1px solid red;
`;
