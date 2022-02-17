import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import styled from "styled-components";
import { Button } from "../../components/core/Button";
import { Grid } from "../../components/core/Grid";
import { Money } from "../../types/stores";
export const ReceiverWallet: React.FC = observer(() => {
  const vendingMachineStore = useStore().shop.vendingMachineStore;
  const gridColumns = [
    { key: "name", title: "Наименование", renderer: (value) => `${value} руб.` },
    { key: "receiverWalletMoneyQty", title: "Монетоприемник (кол-во)" },
    { key: "shopWalletMoneyQty", title: "Касса автомата (кол-во)" },
  ];
  const handleClickBuy = () => vendingMachineStore.buy();
  const handleClickRefund = () => vendingMachineStore.refund();
  const totalReceiverMoney = vendingMachineStore.totalReceiverMoney;
  const totalOrder = vendingMachineStore.totalOrder;
  const canBuy = totalReceiverMoney >= totalOrder && totalOrder > 0 && totalReceiverMoney > 0;
  return (
    <Container>
      <Title>Касса торгового автомата</Title>
      <GridContainer>
        <Grid rows={vendingMachineStore.shopAndReceiverWallets} columns={gridColumns} />
      </GridContainer>
      <TotalOrder />
      <TotalReceiverMoney />
      <Action disabled={!vendingMachineStore.totalReceiverMoney} onClick={handleClickRefund}>
        Забрать деньги
      </Action>
      <Action disabled={!canBuy} onClick={handleClickBuy}>
        Купить
      </Action>
    </Container>
  );
});

const TotalOrder = observer(() => {
  const vendingMachineStore = useStore().shop.vendingMachineStore;
  return (
    <StyledAmount>
      Сумма к оплате:&nbsp;<b>{vendingMachineStore.totalOrder} руб.</b>
    </StyledAmount>
  );
});

const TotalReceiverMoney = observer(() => {
  const vendingMachineStore = useStore().shop.vendingMachineStore;
  return (
    <StyledAmount>
      Сумма в монетоприемнике:&nbsp;<b>{vendingMachineStore.totalReceiverMoney} руб.</b>
    </StyledAmount>
  );
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  flex: 1;
`;
const Title = styled.h4`
  padding: 5px;
`;
const Wallet = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border: 1px solid red;
  padding: 10px;
`;

const StyledAmount = styled.div`
  display: flex;
  padding: 5px;
`;
const GridContainer = styled.div`
  display: flex;
  padding: 10px;
  overflow: auto;
  width: 100%;
`;
const Action = styled(Button)`
  padding: 5px;
`;
