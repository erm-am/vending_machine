import { Money } from "../types";
import { VendingMachine, User } from "./VendingMachine";
import { stores } from "./index";
const { user, vending } = stores;

export const shopActions = {
  cashInsert({ user, moneyId, vending }: { user: User; moneyId: Money; vending: VendingMachine }) {
    if (user.hasMoneyAvailable(moneyId)) {
      user.withdrawMoney(moneyId, 1);
      vending.depositMoneyInReceiverWallet(moneyId, 1);
    } else {
      throw new Error("В кошельке пользователя нет денег");
    }
  },
  refund({ vending, user }: { vending: VendingMachine; user: User }) {
    if (vending.receiverWallet.hasMoney()) {
      const withdrawedMoney = vending.withdrawAllMoneyFromReceiverWallet();
      user.bulkDepositMoney(withdrawedMoney);
    } else {
      throw new Error("В монетоприемнике нет денег");
    }
  },
  addProductReserve({ productId, vending }: { productId: number; vending: VendingMachine }) {
    if (vending.hasAvailableProductWithoutReserved(productId, 1)) {
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
      vending.transferAllMoneyFromReceiverWalletToShopWallet();
      const changeWallet = vending.getChange(totalChangeForUser);
      const withdrawedMoney = vending.withdrawMoneyFromShopWallet(changeWallet);
      user.bulkDepositMoney(withdrawedMoney);
      const reservedProducts = vending.pickUpProducts();
      user.bulkAddProducts(reservedProducts);
    } else {
      throw new Error(`Нет нужного кол-ва денег в монетоприемнике`);
    }
  },
};

export const shopService = {
  cashInsert: (moneyId: Money) => shopActions.cashInsert({ user, moneyId, vending }), // Пользователь вставляет деньги
  refund: () => shopActions.refund({ vending, user }), // Вернуть деньги
  addProductReserve: (productId: number) => shopActions.addProductReserve({ productId, vending }), // Резервируем продукт
  removeProductReserve: (productId: number) => shopActions.removeProductReserve({ productId, vending }), // Снимаем продукт с резерва
  buy: () => shopActions.buy({ user, vending }), //Покупаем
};
