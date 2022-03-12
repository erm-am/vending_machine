import { createContext, useContext } from "react";
import { VendingMachine, User } from "./VendingMachine";
import { stores } from "./index";

export const StoreContext = createContext<typeof stores | null>(null);
