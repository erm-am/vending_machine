import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import styled from "styled-components";
import { Button } from "../../components/Button";
export const UserWallet: React.FC = observer((props) => {
  const userStore = useStore().shop.userStore;

  return (
    <Container>
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
      <Amount>Всего денег: {userStore.totalUserMoney} рублей</Amount>
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;
  justify-content: space-evenly;
  align-items: flex-start;
  flex-wrap: wrap;
  color: white;
`;
const Title = styled.h4`
  text-align: center;
`;
const Money = styled.div`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 40px;
  border-radius: 5px;
  margin: 10px 0;
  display: flex;
  cursor: pointer;
  position: relative;
  background: #242532;
  &:hover {
    background: #22b754;
  }
`;
const MoneyCaption = styled.strong`
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
const Deposit = styled.button`
  display: flex;
`;
const Amount = styled.div`
  display: flex;
  padding: 10px;
  width: 100%;
  justify-content: center;
`;
