import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import styled from "styled-components";
import { Button } from "../../components/core/Button";
export const UserProducts: React.FC = observer((props) => {
  const userStore = useStore().shop.userStore;
  return (
    <Container>
      <Title>ПРодукты пользователя</Title>
      <Products>
        {Array.from(userStore.userProducts).map(([id, { name, qty }]) => {
          return (
            <Product key={id}>
              <div>{name}</div>
              <div>{qty}</div>
            </Product>
          );
        })}
      </Products>
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1;
  height: 100%;
`;
const Title = styled.h4`
  padding: 5px;
`;
const Products = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  padding: 10px;
`;
const Product = styled.strong`
  border: 1px solid #ffffff5c;
  padding: 10px;
  border-radius: 5px;
`;
