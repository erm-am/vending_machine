import { ISelectableShopProductDetail, IShopProductDetail } from "./../../types/stores";
import { VendingMachineStore } from "./VendingMachineStore";
import { UserStore } from "./UserStore";
import { RootStore } from "../index";
import { makeObservable, observable, computed, action, toJS, runInAction } from "mobx";
import { ApiService } from "../../api";
import { MoneyTransaction, ProductTransaction, UserProducts, ShopProducts, ShopSelectableProducts } from "../../types/stores";

export class ShopStore {
  vendingMachineStore: VendingMachineStore; // child store
  userStore: UserStore; // child store
  api: ApiService;
  rootStore: RootStore;

  constructor(rootStore: RootStore, api: ApiService) {
    makeObservable(this, {
      init: action,
      moneyTransaction: action,
      productTransaction: action,
    });
    this.vendingMachineStore = new VendingMachineStore(this);
    this.userStore = new UserStore(this);
    this.api = api;
    this.rootStore = rootStore;
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
      const [shopWallet, userWallet, products, shopMoneyReceiverWallet, userProducts] = await Promise.all([
        this.api.getShopWallet(),
        this.api.getUserWallet(),
        this.api.getShopProducts(),
        this.api.getReceiverWallet(),
        this.api.getUserProducts(),
      ]);
      runInAction(() => {
        this.vendingMachineStore.shopWallet = shopWallet;
        this.vendingMachineStore.shopProducts = this.prepareProducts(products);
        this.vendingMachineStore.receiverWallet = shopMoneyReceiverWallet;
        this.userStore.userWallet = userWallet;
        this.userStore.userProducts = userProducts;
      });
    } catch (e) {
      console.log(e);
    }
  }

  moneyTransaction({ from, to, payload }: MoneyTransaction) {
    for (const [money_id, qty] of payload) {
      from.set(money_id, from.get(money_id) - qty);
      to.set(money_id, to.get(money_id) + qty);
    }
  }
  productTransaction({ from, to, payload }: ProductTransaction) {
    for (const [product_id, detail] of payload) {
      from.set(product_id, { ...from.get(product_id), qty: from.get(product_id).qty - detail.selected });
      to.set(product_id, { ...to.get(product_id), qty: to.get(product_id).qty + detail.selected });
    }
  }
}
