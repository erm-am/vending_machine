import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import styled from "styled-components";
import { Button } from "../../components/Button";
export const UserProducts: React.FC = observer((props) => {
  const userStore = useStore().shop.userStore;
  return (
    <Container>
      {Array.from(userStore.userProducts).map(([id, { name, qty }]) => {
        return (
          <Product key={id}>
            <ProductCaption>{name}</ProductCaption>
            <ProductQuantity>{qty}</ProductQuantity>
          </Product>
        );
      })}
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  padding: 10px;
  justify-content: space-evenly;
`;
const Title = styled.h4`
  text-align: center;
`;
const Product = styled.div`
  color: white;
  display: flex;
  font-size: 12px;
  padding: 10px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background: #242532;
`;
const ProductCaption = styled.strong`
  display: flex;
`;
const ProductQuantity = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  right: -5px;
  border: 1px solid #242532;
  border-radius: 50%;
  padding: 5px;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  display: flex;
`;
