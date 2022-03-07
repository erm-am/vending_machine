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
    return this.getCount(productId) === count;
  }

  // Получить количество продукта
  getCount(productId: number): number {
    return this.products.find((product) => product.id === productId)?.count ?? 0;
  }

  addProduct(productId: number) {
    if (!this.hasProduct(productId)) {
      // this.products.set(productId, 0);
    }
    // const currentCount = this.products.get(productId);
    //  this.products.set(productId, currentCount + 1);
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
}

export class User {
  userWallet: Wallet;
  userProducts: Products;

  constructor() {
    makeAutoObservable(this);
    this.userWallet = new Wallet();
    this.userProducts = new Products();
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
  async loadServerData() {
    const [shopWallet, receiverWallet, shopProducts] = await Promise.all([api.getShopWallet(), api.getReceiverWallet(), api.getShopProducts()]);
    this.shopProducts.initProducts(shopProducts);
    this.shopWallet.initMoney(shopWallet);
    this.receiverWallet.initMoney(receiverWallet);
  }
}
