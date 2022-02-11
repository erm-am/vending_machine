import { ShopStore } from "./index";
import { makeObservable, observable, computed, action, toJS, runInAction } from "mobx";
import { Wallet, Money, UserProducts } from "../../types/stores";

export class UserStore {
  shopStore: ShopStore;
  userProducts: UserProducts = new Map();
  userWallet: Wallet = new Map();
  constructor(shopStore: ShopStore) {
    makeObservable(this, {
      userProducts: observable,
      userWallet: observable,
      totalUserMoney: computed,
      transferUserMoneyToVendingMachine: action,
    });
    this.shopStore = shopStore;
  }

  transferUserMoneyToVendingMachine(money_id: Money) {
    this.shopStore.moneyTransaction({
      from: this.userWallet,
      to: this.shopStore.vendingMachineStore.receiverWallet,
      payload: new Map([[money_id, 1]]),
    });
  }

  get totalUserMoney() {
    const total = Array.from(this.userWallet).reduce((result, [money_id, qty]) => result + qty * money_id, 0);
    return total;
  }
}
