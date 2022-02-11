import React from "react";
import ReactDOM from "react-dom";

// import "./index.css";
import { App } from "./App";
import ErrorBoundary from "./ErrorBoundary";

import { store, RootStore } from "./store/index";
import { StoreContext } from "./store/context";
import { GlobalStyles } from "./global-styles";
ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <GlobalStyles />
      <App />
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
