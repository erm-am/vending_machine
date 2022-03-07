import { Money } from "./../types/stores";
import { getUserProducts } from "./../api/index";
import { makeObservable, observable, computed, action, toJS, runInAction, makeAutoObservable } from "mobx";
import * as api from "../api";
import { IShopProduct, IUserProduct } from "../types/stores";

class Products {
  products: IUserProduct[] | IShopProduct[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  // Существует ли продукт
  hasProduct(productId: number): boolean {
    return !!this.products.find((product) => product.id === productId);
  }

  // Существует ли нужное кол-во продукта
  hasCount(productId: number, count: number): boolean {
    return this.getCount(productId) >= count;
  }

  // Получить количество продукта
  getCount(productId: number): number {
    const foundProduct = this.products.find((product) => product.id === productId);
    //@ts-ignore
    return foundProduct.count - foundProduct.reserved ?? 0;
  }

  // Получить количество зарезервированного продукта
  getReservedCount(productId: number): number {
    console.log("@@@@@@@@@@", this.products);

    //@ts-ignore
    return this.products.find((product) => product.id === productId)?.reserved ?? 0;
  }

  hasReservedCount(productId: number, count: number): boolean {
    return this.getReservedCount(productId) === count;
  }

  //Вставляем продукты (инициализация данных с сервера)
  initProducts(products: IUserProduct[] | IShopProduct[]) {
    this.products = products;
  }
}

class Wallet {
  money: Map<Money, number> = new Map();
  constructor() {
    makeAutoObservable(this);
  }

  // Количество определенной купюры
  getCount(moneyId: Money): number {
    return this.money.get(moneyId) ?? 0;
  }

  // Есть ли хоть какие-нибудь деньги
  hasMoney(): boolean {
    return Array.from(this.money).some(([moneyId, count]) => count > 0);
  }

  // Забрать
  withdraw(moneyId: Money, count: number) {
    const currentMoneyCount = this.getCount(moneyId);
    const newValue = currentMoneyCount - count;
    this.money.set(moneyId, newValue);
  }

  // Положить
  deposit(moneyId: Money, count: number) {
    const currentMoneyCount = this.getCount(moneyId);
    const newValue = currentMoneyCount + count;
    this.money.set(moneyId, newValue);
  }
  initMoney(money: [Money, number][]) {
    this.money = new Map(money);
  }

  get total() {
    return Array.from(this.money).reduce((result, [moneyId, qty]) => result + moneyId * qty, 0);
  }
}

export class User {
  userWallet: Wallet;
  userProducts: Products;

  constructor() {
    makeAutoObservable(this);
    this.userWallet = new Wallet();
    this.userProducts = new Products();
  }

  withdrawMoney(moneyId: Money, count: number) {
    if (this.hasMoneyAvailable(moneyId)) {
      this.userWallet.withdraw(moneyId, count);
    }
  }
  depositMoney(moneyId: Money, count: number) {
    this.userWallet.deposit(moneyId, count);
  }

  hasMoneyAvailable(moneyId: Money) {
    return this.userWallet.getCount(moneyId) > 0;
  }

  depositAllMoneyToUser(money: Map<Money, number>) {
    for (let [moneyId, count] of money) {
      this.depositMoney(moneyId, count);
    }
  }

  async loadServerData() {
    const [userWallet, userProducts] = await Promise.all([api.getUserWallet(), api.getUserProducts()]);
    this.userProducts.initProducts(userProducts);
    this.userWallet.initMoney(userWallet);
  }
}

export class VendingMachine {
  shopProducts: Products;
  shopWallet: Wallet;
  receiverWallet: Wallet;
  constructor() {
    makeAutoObservable(this);
    this.shopProducts = new Products();
    this.shopWallet = new Wallet();
    this.receiverWallet = new Wallet();
  }

  hasReceiverMoneyAvailable(moneyId: Money): boolean {
    return this.receiverWallet.getCount(moneyId) > 0;
  }

  hasProductAvailable(productId: number): boolean {
    return this.shopProducts.getCount(productId) > 0;
  }
  hasReservedProductAvailable(productId: number): boolean {
    return this.shopProducts.getReservedCount(productId) > 0;
  }

  // зарезервировать товар
  addProductReserve(productId) {
    this.shopProducts.products = this.shopProducts.products.map((product) => {
      return product.id === productId ? { ...product, reserved: product.reserved + 1 } : product;
    });
  }

  // Снять с резервации
  removeProductReserve(productId) {
    this.shopProducts.products = this.shopProducts.products.map((product) => {
      return product.id === productId ? { ...product, reserved: product.reserved - 1 } : product;
    });
  }

  //положить деньиг в монетоприемник
  depositMoneyToReceiver(moneyId: Money, count: number) {
    this.receiverWallet.deposit(moneyId, count);
  }

  //Снять все деньиг из монетоприемника
  withdrawAllMoneyFromReceiver() {
    const withdrawedMoney = new Map();
    for (let [moneyId, count] of this.receiverWallet.money) {
      this.receiverWallet.withdraw(moneyId, count);
      if (withdrawedMoney.has(moneyId)) {
        withdrawedMoney.set(moneyId, withdrawedMoney.get(moneyId) + count);
      } else {
        withdrawedMoney.set(moneyId, count);
      }
    }
    return withdrawedMoney;
  }

  async loadServerData() {
    const [shopWallet, receiverWallet, shopProducts] = await Promise.all([api.getShopWallet(), api.getReceiverWallet(), api.getShopProducts()]);
    this.shopProducts.initProducts(shopProducts);
    this.shopWallet.initMoney(shopWallet);
    this.receiverWallet.initMoney(receiverWallet);
  }
  get combinedWallets() {
    const receiverWalletArray = Array.from(this.receiverWallet.money);
    const shopWalletArray = Array.from(this.shopWallet.money);
    const combinedWallets = Array.from({
      length: receiverWalletArray.length,
    }).map((_, index) => {
      const [moneyId, receiverWalletMoneyCount] = receiverWalletArray[index];
      const [, shopWalletMoneyCount] = shopWalletArray[index];
      return {
        moneyId,
        receiverWalletMoneyCount,
        shopWalletMoneyCount,
      };
    });
    return combinedWallets;
  }
  get totalReceiverMoney() {
    return this.receiverWallet.total;
  }

  get totalOrder() {
    //@ts-ignore
    return this.shopProducts.products.reduce((result, current) => {
      //@ts-ignore
      return result + current.price * current.reserved;
      //@ts-ignore
    }, 0);
  }
  get canBuy() {
    //@ts-ignore
    return this.totalReceiverMoney >= this.totalOrder && this.totalOrder > 0 && this.totalReceiverMoney > 0;
  }
}
