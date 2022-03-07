import { ISelectableShopProductDetail, IShopProductDetail } from "../../types/stores";
import { VendingMachineStore } from "./VendingMachineStore";
import { UserStore } from "./UserStore";

import { makeObservable, observable, computed, action, toJS, runInAction } from "mobx";

import { MoneyTransaction, ProductTransaction, UserProducts, ShopProducts, ShopSelectableProducts } from "../../types/stores";

export class ShopStore {
  vendingMachineStore: VendingMachineStore; // child store
  userStore: UserStore; // child store

  constructor() {
    makeObservable(this, {
      init: action,
      moneyTransaction: action,
      productTransaction: action,
    });
    this.vendingMachineStore = new VendingMachineStore(this);
    this.userStore = new UserStore(this);
  }

  prepareProducts(products: ShopProducts): ShopSelectableProducts {
    const selectableProducts = new Map();
    for (const [id, product] of products) {
      selectableProducts.set(id, { ...product, selected: 0, amount: 0 });
    }
    return selectableProducts;
  }
  async init() {
    try {
      // const [shopWallet, userWallet, products, shopMoneyReceiverWallet, userProducts] = await Promise.all([
      //   this.api.getShopWallet(),
      //   this.api.getUserWallet(),
      //   this.api.getShopProducts(),
      //   this.api.getReceiverWallet(),
      //   this.api.getUserProducts(),
      // ]);
      runInAction(() => {
        this.vendingMachineStore.shopWallet = new Map([]);
        this.vendingMachineStore.shopProducts = new Map([]);
        this.vendingMachineStore.receiverWallet = new Map([]);
        this.userStore.userWallet = new Map([]);
        this.userStore.userProducts = new Map([]);
      });
    } catch (e) {
      console.log(e);
    }
  }

  moneyTransaction({ from, to, payload }: MoneyTransaction) {
    for (const [moneyId, qty] of payload) {
      from.set(moneyId, from.get(moneyId) - qty);
      to.set(moneyId, to.get(moneyId) + qty);
    }
  }
  productTransaction({ from, to, payload }: ProductTransaction) {
    for (const [product_id, detail] of payload) {
      from.set(product_id, { ...from.get(product_id), qty: from.get(product_id).qty - detail.selected });
      to.set(product_id, { ...to.get(product_id), qty: to.get(product_id).qty + detail.selected });
    }
  }
}
