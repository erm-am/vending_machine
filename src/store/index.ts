import { VendingMachine, User } from "./VendingMachine";

const vending = new VendingMachine();
const user = new User();
export const stores = {
  vending,
  user,
};

const actions = {
  cashInsert: function cashInsert({ user, moneyId, vending }: { user: User; moneyId: number; vending: VendingMachine }) {
    // if (user.hasMoneyAvailable(moneyId)) {
    //   user.withdrawMoney(moneyId); //снимает деньги
    //   vending.getDepositedMoney().deposit(moneyId, 1); // Закидываем в монетоприемник
    //   //
    // } else {
    //   throw new Error("нет денег");
    // }
  },
};
