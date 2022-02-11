import { createContext, useContext } from "react";
import { store, RootStore } from "./index";

export const StoreContext = createContext(store as RootStore);
