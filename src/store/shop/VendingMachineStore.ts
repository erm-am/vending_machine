import { makeObservable, observable, computed, action, toJS, runInAction } from "mobx";
import { UserProducts, ShopProducts, ShopSelectableProducts, Wallet } from "../../types/stores";
import { ShopStore } from "./index";

export class VendingMachineStore {
  shopStore: ShopStore; // parent store;
  shopProducts: ShopSelectableProducts = new Map();
  receiverWallet: Wallet = new Map();
  shopWallet: Wallet = new Map();
  constructor(shopStore: ShopStore) {
    makeObservable(this, {
      shopProducts: observable,
      shopWallet: observable,
      receiverWallet: observable,
      refund: action,
      incProduct: action,
      decProduct: action,
      resetSelectedProducts: action,
      buy: action,
      getSelectedProducts: action,
      totalOrder: computed,
      totalReceiverMoney: computed,
      totalShopMoney: computed,
    });
    this.shopStore = shopStore;
  }

  getChange(shopMoneyWallet: Wallet, changeValue: number): Wallet {
    // Расчет сдачи
    const userChange: Wallet = new Map();
    const filteredShopMoneyWallet = Array.from(shopMoneyWallet).sort(([left], [right]) => right - left); // Старшие монеты в приоритете
    let restMoneyForChange = changeValue;
    while (restMoneyForChange !== 0) {
      for (let [money_id, qty] of filteredShopMoneyWallet) {
        if (money_id <= restMoneyForChange && qty) {
          if (userChange.has(money_id)) {
            userChange.set(money_id, userChange.get(money_id) + 1);
          } else {
            userChange.set(money_id, 1);
          }
          restMoneyForChange = restMoneyForChange - money_id;
          break;
        }
      }
    }
    return userChange;
  }

  getSelectedProducts(products: ShopSelectableProducts): ShopSelectableProducts {
    const selectedProducts = Array.from(products).filter(([id, detail]) => detail.selected);
    return new Map(selectedProducts);
  }

  buy() {
    const { userProducts } = this.shopStore.userStore;
    const { shopWallet, receiverWallet, shopProducts, totalOrder, totalReceiverMoney } = this;
    const changeForUser = totalReceiverMoney - totalOrder;
    if (totalReceiverMoney < totalOrder) {
      console.log("не хватает денег в монетоприемнике");
      return;
    }

    this.shopStore.moneyTransaction({ from: receiverWallet, to: shopWallet, payload: receiverWallet });
    this.shopStore.moneyTransaction({ from: shopWallet, to: receiverWallet, payload: this.getChange(shopWallet, changeForUser) });
    this.shopStore.productTransaction({ from: shopProducts, to: userProducts, payload: this.getSelectedProducts(shopProducts) });
    this.resetSelectedProducts();
  }

  refund() {
    this.shopStore.moneyTransaction({
      from: this.receiverWallet,
      to: this.shopStore.userStore.userWallet,
      payload: this.receiverWallet,
    });
  }
  incProduct(product_id: number) {
    const product = this.shopProducts.get(product_id);
    if (product.selected < product.qty) {
      this.shopProducts.set(product_id, { ...product, selected: product.selected + 1, amount: product.price * (product.selected + 1) });
    }
  }
  decProduct(product_id: number) {
    const product = this.shopProducts.get(product_id);
    if (product.selected > 0) {
      this.shopProducts.set(product_id, { ...product, selected: product.selected - 1, amount: product.price * (product.selected - 1) });
    }
  }

  resetSelectedProducts() {
    for (const [id, data] of this.shopProducts) {
      this.shopProducts.set(id, { ...data, selected: 0, amount: 0 });
    }
  }

  get totalOrder() {
    return Array.from(this.shopProducts).reduce((result, [id, { amount }]) => result + amount, 0);
  }

  get totalReceiverMoney() {
    return Array.from(this.receiverWallet).reduce((result, [money_id, qty]) => result + money_id * qty, 0);
  }
  get totalShopMoney() {
    return Array.from(this.shopWallet).reduce((result, [money_id, qty]) => result + result + money_id * qty, 0);
  }
}
