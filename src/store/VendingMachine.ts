import { IProduct, Money } from "./../types/stores";
import { getUserProducts } from "./../api/index";
import { makeObservable, observable, computed, action, toJS, runInAction, makeAutoObservable } from "mobx";
import * as api from "../api";
import { IShopProduct, IUserProduct } from "../types/stores";

// catalogue: Map<id, IProduct>
// shopProducts: Map<id, count>
// userProducts: Map<id, count>
// const productId = 1
// const count = shopProducts.get(productId)
// const product = catalogue.get(productId)
// const productsMap = Map.fromEntries(products.map(p => [p.id, p]))
// const productsMap = new Map(products.map(p => [p.id, p]))
// [{ id: 1, count: 2 }, { id: 2, count: 1 }]

class Products {
  products: IShopProduct[] | IUserProduct[] = [];
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
    //@ts-ignore
    return this.products.find((product) => product.id === productId)?.reserved ?? 0;
  }

  hasReservedCount(productId: number, count: number): boolean {
    return this.getReservedCount(productId) === count;
  }

  //Вставляем продукты (инициализация данных с сервера)
  setProducts(products: IUserProduct[] | IShopProduct[]) {
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
  setMoney(money: [Money, number][]) {
    this.money = new Map(money);
  }

  get total() {
    return Array.from(this.money).reduce((result, [moneyId, qty]) => result + moneyId * qty, 0);
  }
}

export class User {
  catalogue: Catalogue;
  userWallet: Wallet;
  userProducts: Products;

  constructor() {
    makeAutoObservable(this);
    this.userWallet = new Wallet();
    this.userProducts = new Products();
    this.catalogue = new Catalogue();
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
    const [catalogue, userWallet, userProducts] = await Promise.all([api.getCatalogue(), api.getUserWallet(), api.getUserProducts()]);
    this.catalogue.setProducts(catalogue);
    this.userProducts.setProducts(userProducts);
    this.userWallet.setMoney(userWallet);
  }
}

class Catalogue {
  products: IProduct[];
  setProducts(products: IProduct[]) {
    this.products = products;
  }
}
export class VendingMachine {
  catalogue: Catalogue;
  shopProducts: Products;
  shopWallet: Wallet;
  receiverWallet: Wallet;

  constructor() {
    makeAutoObservable(this);
    this.catalogue = new Catalogue();
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

  //Забрать все зарезервированные продукты
  takeReservedProducts() {
    //РАЗБИТЬ НА 3 МЕТОДА
    const products = [];
    this.shopProducts.products.forEach((product: IShopProduct) => {
      const reservedCount = product.reserved;
      product.count = product.count - reservedCount;
      product.reserved = 0;
    });
    return products;
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
    const [catalogue, shopWallet, receiverWallet, shopProducts] = await Promise.all([
      api.getCatalogue(),
      api.getShopWallet(),
      api.getReceiverWallet(),
      api.getShopProducts(),
    ]);
    this.shopProducts.setProducts(shopProducts);
    this.shopWallet.setMoney(shopWallet);
    this.receiverWallet.setMoney(receiverWallet);
    this.catalogue.setProducts(catalogue);
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
