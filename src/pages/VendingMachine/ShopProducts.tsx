import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import styled from "styled-components";
import { Button } from "../../components/core/Button";
import { Product } from "../../components/Product";

export const ShopProducts: React.FC = observer(() => {
  const { vending } = useStore();

  console.log("shopProducts.products", vending);
  return (
    <Container>
      <Title>Продукты торгового автомата</Title>
      <Products>
        {vending.shopProducts.products.map((product) => {
          return (
            <Product key={product.id} disabled={!product.count}>
              <Label>{product.name}</Label>
              {/* <Label>
                <Button onClick={() => vendingMachineStore.decProduct(id)} disabled={!qty}>
                  -
                </Button>
                {selected}\{qty}
                <Button onClick={() => vendingMachineStore.incProduct(id)} disabled={!qty}>
                  +
                </Button>
              </Label> */}
              <Label>Цена: {product.price}</Label>
            </Product>
          );
        })}
      </Products>
    </Container>
  );
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
const Label = styled.span`
  padding: 5px;
`;
const Products = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: repeat(auto-fit, minmax(134px, 1fr));
  grid-template-rows: repeat(auto-fit, minmax(134px, 1fr));
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  padding: 10px;
`;
