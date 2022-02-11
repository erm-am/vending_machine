import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import { UserWallet } from "./UserWallet";
import { ShopWallet } from "./ShopWallet";
import { ReceiverWallet } from "./ReceiverWallet";
import { ShopProducts } from "./ShopProducts";
import { UserProducts } from "./UserProducts";
import { Page } from "../../components/Layout";
import styled from "styled-components";
export const VendingMachine: React.FC = observer((props) => {
  const shop = useStore().shop;
  useEffect(() => {
    shop.init();
  }, []);
  return (
    <Container>
      <ShopSection>
        <Wrapper direction="row">
          <ShopProducts />
          <ReceiverWallet />
        </Wrapper>
      </ShopSection>
      <UserSection>
        <Wrapper direction="column">
          <UserWallet />
          <UserProducts />
        </Wrapper>
      </UserSection>
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const ShopSection = styled.div`
  flex-direction: row;

  display: flex;
  flex: 1;
  background-color: #20212e;
  border: 1px dotted red;
  justify-content: center;
`;
const UserSection = styled.div`
  flex-direction: row;

  display: flex;
  flex: 1;
  background-color: #191923;
  border: 1px dotted red;
  justify-content: center;
`;
const Wrapper = styled.div<{ direction: "row" | "column" }>`
  display: flex;
  width: 800px;
  align-items: flex-start;
  flex-direction: ${(p) => p.direction};
`;
