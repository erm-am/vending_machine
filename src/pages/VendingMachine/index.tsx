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
    <Shop>
      <VendingSection>
        <Limiter direction="row">
          <ShopProducts />
          <ReceiverWallet />
        </Limiter>
      </VendingSection>

      <UserSection>
        <Limiter direction="row">
          <UserProducts />
          <UserWallet />
        </Limiter>
      </UserSection>
    </Shop>
  );
});

const Shop = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  color: white;
`;

const VendingSection = styled.div`
  display: flex;
  flex: 1;
  background-color: #20212e;
  justify-content: center;
  padding: 20px;
`;

const UserSection = styled.div`
  display: flex;
  flex: 1;
  background-color: #191923;
  justify-content: center;
  padding: 20px;
`;

const Limiter = styled.div<{ direction: "row" | "column" }>`
  display: flex;
  min-width: 900px;
  align-items: flex-start;
  flex-direction: ${(p) => p.direction};
`;
