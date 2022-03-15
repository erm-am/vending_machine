import { Money } from "../types";
import { VendingMachine, User } from "./VendingMachine";

const vending = new VendingMachine();
const user = new User();

export const stores = {
  vending,
  user,
};
