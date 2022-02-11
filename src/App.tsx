import * as React from "react";
import { Page } from "./components/Layout";
import { VendingMachine } from "./pages/VendingMachine";
export const App = () => {
  return (
    <Page>
      <VendingMachine />
    </Page>
  );
};
