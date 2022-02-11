import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import styled from "styled-components";
import { Button } from "../../components/Button";

export const ShopProducts: React.FC = observer((props) => {
  const vendingMachineStore = useStore().shop.vendingMachineStore;
  return (
    <Container>
      {/* <Title>Продукты</Title> */}
      {Array.from(vendingMachineStore.shopProducts).map(([id, { name, amount, qty, selected, price }]) => {
        return (
          <StyledProduct key={id}>
            <ProductCaption>
              {name} {amount}
            </ProductCaption>
            <ProductQuantity>
              <Button onClick={() => vendingMachineStore.decProduct(id)} disabled={!qty}>
                -
              </Button>
              {selected}\{qty}
              <Button onClick={() => vendingMachineStore.incProduct(id)} disabled={!qty}>
                +
              </Button>
            </ProductQuantity>
            <ProductPrice>Цена: {price}</ProductPrice>
          </StyledProduct>
        );
      })}
    </Container>
  );
});

const Container = styled.div`
  display: flex;

  flex-direction: row;
  flex-wrap: wrap;

  width: 540px;
  height: 100%;
  color: white;
  justify-content: space-evenly;
`;
const Title = styled.h4`
  text-align: center;
`;
const StyledProduct = styled.div`
  display: flex;

  padding: 5px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid white;
  background: #242532;
  width: 150px;
  height: 110px;
`;
const ProductCaption = styled.strong`
  display: flex;
`;
const ProductQuantity = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ProductPrice = styled.div`
  display: flex;
`;
const SelectedProduct = styled.div<{ selected: boolean }>`
  width: 100%;
  background: ${(props) => (props.selected ? "pink" : "transparent")};
`;
const Amount = styled.div`
  display: flex;
`;
