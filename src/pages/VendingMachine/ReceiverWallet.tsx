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

  return (
    <Container>
      <Title>Касса торгового автомата</Title>
      <GridContainer>
        <Grid rows={vendingMachineStore.shopAndReceiverWallets} columns={gridColumns} />
      </GridContainer>
      <TotalOrder />
      <TotalReceiverMoney />
    </Container>
  );
});

const TotalOrder = observer(() => {
  const vendingMachineStore = useStore().shop.vendingMachineStore;
  return (
    <StyledAmount>
      Сумма к оплате: <strong>{vendingMachineStore.totalOrder}</strong>
    </StyledAmount>
  );
});

const TotalReceiverMoney = observer(() => {
  const vendingMachineStore = useStore().shop.vendingMachineStore;
  return (
    <StyledAmount>
      Сумма в монетоприемнике: <strong>{vendingMachineStore.totalReceiverMoney}</strong>
    </StyledAmount>
  );
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 50%;
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

const Money = styled.span`
  display: flex;
  flex: 1;
  padding: 5px;
  border: 1px solid #ffffff5c;
`;
const MoneyCaption = styled.span`
  display: flex;
`;

const StyledAmount = styled.div`
  display: flex;

  padding: 5px;
`;
const GridContainer = styled.div`
  display: flex;
  padding: 10px;
`;
