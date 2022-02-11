import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import styled from "styled-components";
import { Button } from "../../components/Button";
export const ShopWallet: React.FC = observer((props) => {
  const vendingMachineStore = useStore().shop.vendingMachineStore;
  return (
    <Container>
      <Title>Деньги внутри автомата</Title>
      {Array.from(vendingMachineStore.shopWallet).map(([money_id, qty]) => {
        return (
          <Money key={money_id}>
            <MoneyCaption> {money_id}</MoneyCaption>
            <MoneyQuantity> {qty}</MoneyQuantity>
          </Money>
        );
      })}
      <Amount>Всего денег {vendingMachineStore.totalShopMoney}</Amount>
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  width: 300px;
  flex-direction: column;
  padding: 5px;
  background: gray;
  border: 1px solid black;
`;
const Title = styled.h4`
  text-align: center;
`;
const Money = styled.div`
  display: flex;

  padding: 5px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const MoneyCaption = styled.strong`
  display: flex;
`;
const MoneyQuantity = styled.div`
  display: flex;
`;

const Amount = styled.div`
  display: flex;
  font-weight: bold;
`;
