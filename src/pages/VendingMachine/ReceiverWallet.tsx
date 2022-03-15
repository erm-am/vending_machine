import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import styled from "styled-components";
import { Button } from "../../components/core/Button";
import { Grid } from "../../components/core/Grid";
import { Row, Cell } from "../../components/core/Grid/Grid.styled";
import { shopService } from "../../store/vendingMachine.service";
export const ReceiverWallet: React.FC = observer(() => {
  const { vending } = useStore();
  const gridColumns = [
    { key: "moneyId", title: "Наименование", renderer: (value) => `${value} руб.` },
    { key: "receiverWalletCount", title: "Монетоприемник (кол-во)" },
    { key: "shopWalletCount", title: "Касса автомата (кол-во)" },
  ];
  const handleClickBuy = () => shopService.buy();
  const handleClickRefund = () => shopService.refund();

  return (
    <Container>
      <Title>Касса торгового автомата</Title>
      <GridContainer>
        <Grid columns={gridColumns}>
          {Array.from(vending.receiverWallet.money).map(([productId, receiverWalletCount]) => {
            const shopWalletCount = vending.shopWallet.money.get(productId);
            return (
              <Row key={productId}>
                <Cell>{productId}</Cell>
                <Cell>{receiverWalletCount}</Cell>
                <Cell>{shopWalletCount}</Cell>
              </Row>
            );
          })}
        </Grid>
      </GridContainer>
      <TotalOrder />
      <TotalReceiverMoney />
      <Action disabled={vending.totalReceiverMoney === 0} onClick={handleClickRefund}>
        Забрать деньги
      </Action>
      <Action disabled={!vending.canBuy} onClick={handleClickBuy}>
        Купить
      </Action>
    </Container>
  );
});

const TotalOrder = observer(() => {
  const { vending } = useStore();
  return (
    <StyledAmount>
      Сумма к оплате:&nbsp;<b>{vending.totalOrder} руб.</b>{" "}
    </StyledAmount>
  );
});

const TotalReceiverMoney = observer(() => {
  const { vending } = useStore();
  return (
    <StyledAmount>
      Сумма в монетоприемнике:&nbsp;<b>{vending.totalReceiverMoney} руб.</b>
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
