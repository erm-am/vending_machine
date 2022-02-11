import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import styled from "styled-components";
import { Button } from "../../components/Button";
export const ReceiverWallet: React.FC = observer(() => {
  const vendingMachineStore = useStore().shop.vendingMachineStore;
  return (
    <Container>
      <Title>Монетоприемник</Title>
      {Array.from(vendingMachineStore.receiverWallet).map(([money_id, qty]) => {
        return (
          <Money key={money_id}>
            <MoneyCaption>
              {money_id} {qty}
            </MoneyCaption>
          </Money>
        );
      })}
      <Button
        onClick={() => {
          vendingMachineStore.refund();
        }}
      >
        Забрать деньги
      </Button>
      <Button onClick={() => vendingMachineStore.buy()}>Купить</Button>
      <TotalOrder />
      <TotalReceiverMoney />
    </Container>
  );
});

const TotalOrder = observer(() => {
  const vendingMachineStore = useStore().shop.vendingMachineStore;
  return <StyledAmount>Сумма к оплате: {vendingMachineStore.totalOrder}</StyledAmount>;
});

const TotalReceiverMoney = observer(() => {
  const vendingMachineStore = useStore().shop.vendingMachineStore;
  return <StyledAmount>Сумма в монетоприемнике: {vendingMachineStore.totalReceiverMoney}</StyledAmount>;
});

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 5px;
  color: white;
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

const StyledAmount = styled.div`
  display: flex;
  font-weight: bold;
`;
