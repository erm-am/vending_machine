import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import styled from "styled-components";
import { Button } from "../../components/core/Button";
export const UserWallet: React.FC = observer((props) => {
  const userStore = useStore().shop.userStore;

  return (
    <Container>
      <Title>Деньги пользователя</Title>
      <Wallet>
        {Array.from(userStore.userWallet).map(([money_id, qty]) => {
          return (
            <Money
              key={money_id}
              onClick={() => {
                if (qty > 0) userStore.transferUserMoneyToVendingMachine(money_id);
              }}
            >
              <MoneyCaption>{money_id} руб</MoneyCaption>
              <MoneyQuantity title="Количество">{qty}</MoneyQuantity>
            </Money>
          );
        })}
      </Wallet>
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: 50%;
  height: 100%;
`;
const Title = styled.h4`
  padding: 5px;
`;
const Wallet = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  padding: 10px;
`;

const Money = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  display: flex;
  cursor: pointer;
  position: relative;
  background: #242532;
  &:hover {
    background: #22b754;
  }
`;
const MoneyCaption = styled.span`
  display: flex;
`;
const MoneyQuantity = styled.div`
  display: flex;
  position: absolute;
  right: 2px;
  top: 2px;
  border-radius: 3px;
  font-size: 12px;
  border: 1px solid gray;
  padding: 2px;
`;

const Amount = styled.div`
  display: flex;
  padding: 10px;
  width: 100%;
  justify-content: center;
`;
