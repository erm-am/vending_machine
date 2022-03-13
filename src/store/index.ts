import { Money } from "../types";
import { VendingMachine, User } from "./VendingMachine";

const vending = new VendingMachine();
const user = new User();

export const stores = {
  vending,
  user,
};

export const shopActions = {
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
      const withdrawedMoney = vending.bulkWithdrawMoneyFromReceiver(); // снять деньги с монетоприемника + получаем их
      user.bulkDepositMoney(withdrawedMoney); // Запихнуть  деньги в кошелек пользователя
    } else {
      throw new Error("В монетоприемнике нет денег");
    }
  },
  addProductReserve({ productId, vending }: { productId: number; vending: VendingMachine }) {
    if (vending.hasAvailableProduct(productId, 1)) {
      vending.addProductReserve(productId, 1);
    } else {
      throw new Error(`Нет возможности зарезервировать продукт c id ${productId} `);
    }
  },
  removeProductReserve({ productId, vending }: { productId: number; vending: VendingMachine }) {
    if (vending.hasReservedProduct(productId, 1)) {
      vending.removeProductReserve(productId, 1);
    } else {
      throw new Error(`Нет зарезеивированных продуктов c id ${productId}`);
    }
  },

  buy({ user, vending }: { user: User; vending: VendingMachine }) {
    if (vending.canBuy) {
      const totalChangeForUser = vending.calculateChangeValue();
      vending.transferMoneyFromReceiverToShop();
      const changeWallet = vending.getChange(totalChangeForUser);
      const withdrawedMoney = vending.bulkWithdrawMoneyFromShop(changeWallet);
      user.bulkDepositMoney(withdrawedMoney);
      const reservedProducts = vending.withdrawProducts();
      user.bulkDepositProducts(reservedProducts);
    } else {
      throw new Error(`Нет нужного кол-ва денег в монетоприемнике`);
    }
  },
};

export const shopService = {
  cashInsert: (moneyId: Money) => shopActions.cashInsert({ user, moneyId, vending }), // Пользователь вставляет деньги
  refund: () => shopActions.refund({ vending, user }), // Забираем деньги из монетоприемника
  addProductReserve: (productId: number) => shopActions.addProductReserve({ productId, vending }), // Резервируем продукт
  removeProductReserve: (productId: number) => shopActions.removeProductReserve({ productId, vending }), // снимаем продукт с резерва
  buy: () => shopActions.buy({ user, vending }), //покупаем
};
