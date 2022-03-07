import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";
import styled from "styled-components";
import { Button } from "../../components/core/Button";
import { Product } from "../../components/Product";
export const UserProducts: React.FC = observer((props) => {
  return <div>1</div>;

  // const { userStore } = useStore().shop;
  // return (
  //   <Container>
  //     <Title>Продукты пользователя (readonly)</Title>
  //     <Products>
  //       {Array.from(userStore.userProducts).map(([id, { name, qty }]) => {
  //         return (
  //           <Product key={id} disabled={!qty}>
  //             <Label>{name}</Label>
  //             <Label>{qty} (шт.)</Label>
  //           </Product>
  //         );
  //       })}
  //     </Products>
  //   </Container>
  // );
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
  text-align: center;
`;

const Products = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: repeat(3, minmax(80px, 1fr));
  grid-template-rows: repeat(3, minmax(80px, 1fr));
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  padding: 10px;
`;
