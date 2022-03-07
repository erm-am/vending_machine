import React from "react";
import ReactDOM from "react-dom";

// import "./index.css";
import { App } from "./App";
import ErrorBoundary from "./ErrorBoundary";

import { stores } from "./store/index";
import { StoreContext } from "./store/context";
import { GlobalStyles } from "./global-styles";

console.log("stores", stores);
ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={stores}>
      <GlobalStyles />
      <App />
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
