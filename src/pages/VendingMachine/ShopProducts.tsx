import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import styled from "styled-components";
import { Button } from "../../components/core/Button";

export const ShopProducts: React.FC = observer((props) => {
  const vendingMachineStore = useStore().shop.vendingMachineStore;
  return (
    <Container>
      <Title>Продукты</Title>
      <Products>
        {Array.from(vendingMachineStore.shopProducts).map(([id, { name, amount, qty, selected, price }]) => {
          return (
            <Product key={id}>
              <div>
                {name} {amount}
              </div>
              <div>
                <Button onClick={() => vendingMachineStore.decProduct(id)} disabled={!qty}>
                  -
                </Button>
                {selected}\{qty}
                <Button onClick={() => vendingMachineStore.incProduct(id)} disabled={!qty}>
                  +
                </Button>
              </div>
              <div>Цена: {price}</div>
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
