import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import styled from "styled-components";
import { Button } from "../../components/core/Button";
import { Product } from "../../components/Product";
import { shopService } from "../../store/vendingMachine.service";

export const ShopProducts: React.FC = observer(() => {
  const { vending } = useStore();

  const handleClickAddProductReserve = (productId: number) => {
    shopService.addProductReserve(productId);
  };
  const handleClickRemoveProductReserve = (productId: number) => {
    shopService.removeProductReserve(productId);
  };

  return (
    <Container>
      <Title>Продукты торгового автомата</Title>
      <Products>
        {vending.catalogue.map((product) => {
          const productId = product.id;
          const productCount = vending.shopProducts.products.get(productId);
          const reservedProductCount = vending.reservedProducts.products.get(productId) ?? 0;
          return (
            <Product key={product.id} disabled={!productCount}>
              <Label>{product.name}</Label>
              <Label>
                <Button onClick={() => handleClickRemoveProductReserve(product.id)} disabled={!productCount}>
                  -
                </Button>
                {reservedProductCount}\{productCount}
                <Button onClick={() => handleClickAddProductReserve(product.id)} disabled={!productCount}>
                  +
                </Button>
              </Label>
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
