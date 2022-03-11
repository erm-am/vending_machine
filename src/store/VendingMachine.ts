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
  products: Map<number, number> = new Map();
  constructor() {
    makeAutoObservable(this);
  }

  // Существует ли продукт
  hasProduct(productId: number): any {
    return this.products.has(productId);
    //return !!this.products.find((product) => product.id === productId);
  }

  // Существует ли нужное кол-во продукта
  hasCount(productId: number, count: number): boolean {
    return this.getCount(productId) >= count;
  }

  // Получить количество продукта
  getCount(productId: number): number {
    return this.products.get(productId) ?? 0;
  }

  //  Добавляем продукт в резерв
  addProductReserve(productId: number, count: number) {
    this.products.set(productId, this.getCount(productId) + count);
  }

  //  Удаляем продукт из резверва
  removeProductReserve(productId: number, count: number) {
    this.products.set(productId, this.getCount(productId) - count);
  }

  //Вставляем продукты (инициализация данных с сервера)
  setProducts(products: [number, number][]) {
    this.products = new Map(products);
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
  catalogue: IProduct[];
  shopProducts: Products;
  reservedProducts: Products;
  shopWallet: Wallet;
  receiverWallet: Wallet;
  constructor() {
    this.catalogue = [];
    this.shopProducts = new Products();
    this.reservedProducts = new Products();
    this.shopWallet = new Wallet();
    this.receiverWallet = new Wallet();
    makeAutoObservable(this);
  }

  // Есть ли товар в нужном кол-ве (исключаем зарезервированные)
  hasAvailableProduct(productId: number, count: number): boolean {
    const productCount = this.shopProducts.getCount(productId);
    const reservedProductCount = this.reservedProducts.getCount(productId);
    return productCount - reservedProductCount >= count;
  }
  // Есть ли зарезервированный товар в нужном кол-ве
  hasReservedProduct(productId: number, count: number): boolean {
    return this.reservedProducts.hasCount(productId, count);
  }

  // Добавить продукт в список резервов
  addProductReserve(productId: number, count: number) {
    this.reservedProducts.addProductReserve(productId, count);
  }
  // Убрать продукт из списка резервов
  removeProductReserve(productId: number, count: number) {
    this.reservedProducts.removeProductReserve(productId, count);
  }

  depositMoneyToReceiver(moneyId: Money, count: number) {
    this.receiverWallet.deposit(moneyId, count);
  }
  async loadServerData() {
    const [catalogue, shopProducts, shopWallet, receiverWallet] = await Promise.all([
      api.getCatalogue(),
      api.getShopProducts(),
      api.getShopWallet(),
      api.getReceiverWallet(),
    ]);
    console.log("!!!!", catalogue);
    this.catalogue = catalogue;
    this.shopProducts.setProducts(shopProducts);
    this.shopWallet.setMoney(shopWallet);
    this.receiverWallet.setMoney(receiverWallet);
  }
}
