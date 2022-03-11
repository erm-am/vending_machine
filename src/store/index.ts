import { Money } from "../types/stores";
import { VendingMachine, User } from "./VendingMachine";

const vending = new VendingMachine();
const user = new User();
// const shop = new Shop(vending, user);
export const stores = {
  vending,
  user,
};

// Тут будут все действия по проекту (снять деньги, вставить, забрать товар, отдать товар итд)
const shopActions = {
  cashInsert({ user, moneyId, vending }: { user: User; moneyId: Money; vending: VendingMachine }) {
    if (user.hasMoneyAvailable(moneyId)) {
      user.withdrawMoney(moneyId, 1); // Снимает деньги у пользователя (1 шт) (добавить проверку)
      vending.depositMoneyToReceiver(moneyId, 1); // Закидываем в монетоприемник (1 шт)
    } else {
      throw new Error("В кошельке пользователя нет денег");
    }
  },
  refund({ vending, user }: { vending: VendingMachine; user: User }) {
    if (vending.receiverWallet.hasMoney()) {
      const withdrawedMoney = vending.withdrawAllMoneyFromReceiver(); // снять деньги с монетоприемника + получаем их
      user.depositAllMoneyToUser(withdrawedMoney); // Запихнуть  деньги в кошелек пользователя
    } else {
      throw new Error("В монетоприемнике нет денег");
    }
  },
  addProductReserve({ productId, vending }: { productId: number; vending: VendingMachine }) {
    if (vending.hasProductAvailable(productId)) {
      vending.addProductReserve(productId); // зарезервировать товар
    } else {
      throw new Error("Данный продект закончился");
    }
    //
  },
  removeProductReserve({ productId, vending }: { productId: number; vending: VendingMachine }) {
    if (vending.hasReservedProductAvailable(productId)) {
      vending.removeProductReserve(productId); // Снять резерв
    } else {
      throw new Error(`нет зарезеивированных продуктов c id ${productId}`);
    }
    //
  },

  buy({ user, vending }: { user: User; vending: VendingMachine }) {
    if (vending.canBuy) {
      console.log("buying");
      //алгоритм покупки товара
      const products = vending.takeReservedProducts();
      // const withdrawedReservedProducts  = vending.withdrawReservedProducts();
      // const withdrawedReservedProducts  = vending.withdrawReservedProducts();
    } else {
      throw new Error(`Нет нужного кол-ва денег в монетоприемнике`);
    }
  },
};

export const shopService = {
  cashInsert: (moneyId: Money) => shopActions.cashInsert({ user, moneyId, vending }), // Пользователь вставляет деньги
  refund: () => shopActions.refund({ vending, user }), // Забираем бабки из монетоприемника
  addProductReserve: (productId: number) => shopActions.addProductReserve({ productId, vending }), // Резервируем продукт
  removeProductReserve: (productId: number) => shopActions.removeProductReserve({ productId, vending }), // снимаем продукт с резерва
  buy: () => shopActions.buy({ user, vending }), // подтверждаем покупку
};
