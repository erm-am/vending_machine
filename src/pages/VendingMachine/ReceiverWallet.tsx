import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import styled from "styled-components";
import { Button } from "../../components/core/Button";
export const ReceiverWallet: React.FC = observer(() => {
  const vendingMachineStore = useStore().shop.vendingMachineStore;
  return (
    <Container>
      <Title>Касса автомата</Title>
      <table>
        <thead>
          <th>Купюра</th>
          <th>В монетоприемнике</th>
          <th>В кассе автомата</th>
        </thead>

        <tbody>
          {Array.from(vendingMachineStore.receiverWallet).map(([money_id, qty]) => {
            return (
              <tr key={money_id}>
                <td>{money_id} руб</td>
                <td>{qty}</td>
                <td>0</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* <Wallet>
        {Array.from(vendingMachineStore.receiverWallet).map(([money_id, qty]) => {
          return (
            <Money key={money_id}>
              <MoneyCaption>
                {money_id} {qty}
              </MoneyCaption>
            </Money>
          );
        })}
      </Wallet> */}

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
  flex-direction: column;

  flex: 1;
  height: 100%;
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

const Money = styled.strong`
  display: flex;
  flex: 1;
  padding: 5px;
  border: 1px solid #ffffff5c;
`;
const MoneyCaption = styled.strong`
  display: flex;
`;

const StyledAmount = styled.div`
  display: flex;
  font-weight: bold;
`;
