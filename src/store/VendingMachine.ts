import { IProduct, Money, MoneyWallet } from "./../types/stores";
import { makeAutoObservable } from "mobx";
import * as api from "../api";

class Products {
  products: Map<number, number> = new Map();
  constructor() {
    makeAutoObservable(this);
  }

  hasProduct(productId: number): any {
    return this.products.has(productId);
  }

  hasCount(productId: number, count: number): boolean {
    return this.getCount(productId) >= count;
  }

  getCount(productId: number): number {
    return this.products.get(productId) ?? 0;
  }

  addProduct(productId: number, count: number) {
    this.products.set(productId, this.getCount(productId) + count);
  }

  removeProduct(productId: number, count: number) {
    this.products.set(productId, this.getCount(productId) - count);
  }

  setProducts(products: [number, number][]) {
    this.products = new Map(products);
  }

  clear() {
    this.products = new Map();
  }
}

class Wallet {
  money: MoneyWallet = new Map();
  constructor() {
    makeAutoObservable(this);
  }

  getCount(moneyId: Money): number {
    return this.money.get(moneyId) ?? 0;
  }

  hasMoney(): boolean {
    return Array.from(this.money).some(([moneyId, count]) => count > 0);
  }

  withdraw(moneyId: Money, count: number) {
    const currentMoneyCount = this.getCount(moneyId);
    const newValue = currentMoneyCount - count;
    this.money.set(moneyId, newValue);
  }

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
  userWallet: Wallet;
  userProducts: Products;

  constructor() {
    makeAutoObservable(this);
    this.userWallet = new Wallet();
    this.userProducts = new Products();
  }

  // Снять деньги
  withdrawMoney(moneyId: Money, count: number) {
    if (this.hasMoneyAvailable(moneyId)) {
      this.userWallet.withdraw(moneyId, count);
    }
  }
  // Положить деньги
  depositMoney(moneyId: Money, count: number) {
    this.userWallet.deposit(moneyId, count);
  }
  // Есть ли деньги данной купюры
  hasMoneyAvailable(moneyId: Money) {
    return this.userWallet.getCount(moneyId) > 0;
  }

  // положить несколько видов купюр на счет
  bulkDepositMoney(money: MoneyWallet) {
    for (let [moneyId, count] of money) {
      this.depositMoney(moneyId, count);
    }
  }

  bulkDepositProducts(products) {
    for (let [id, count] of products) this.userProducts.addProduct(id, count);
  }

  async loadServerData() {
    const [catalogue, userWallet, userProducts] = await Promise.all([api.getCatalogue(), api.getUserWallet(), api.getUserProducts()]);

    this.userProducts.setProducts(userProducts);
    this.userWallet.setMoney(userWallet);
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
    this.reservedProducts.addProduct(productId, count);
  }
  // Убрать продукт из списка резервов
  removeProductReserve(productId: number, count: number) {
    this.reservedProducts.removeProduct(productId, count);
  }

  // Пополнить монетоприемник
  depositMoneyToReceiver(moneyId: Money, count: number) {
    this.receiverWallet.deposit(moneyId, count);
  }

  // Забрать все деньги из монетоприемника
  bulkWithdrawMoneyFromReceiver(): MoneyWallet {
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

  bulkWithdrawMoneyFromShop(money: MoneyWallet) {
    const withdrawedMoney = new Map();
    for (let [moneyId, count] of money) {
      this.shopWallet.withdraw(moneyId, count);
      if (withdrawedMoney.has(moneyId)) {
        withdrawedMoney.set(moneyId, withdrawedMoney.get(moneyId) + count);
      } else {
        withdrawedMoney.set(moneyId, count);
      }
    }
    return withdrawedMoney;
  }

  bulkDepositMoneyToShop(money: MoneyWallet) {
    for (let [moneyId, count] of money) {
      this.shopWallet.deposit(moneyId, count);
    }
  }

  transferMoneyFromReceiverToShop() {
    const withdrawedMoneyFromReceiver = this.bulkWithdrawMoneyFromReceiver();
    this.bulkDepositMoneyToShop(withdrawedMoneyFromReceiver);
  }

  calculateChangeValue(): number {
    const totalOrder = this.totalOrder;
    const totalReceiverMoney = this.totalReceiverMoney;
    const changeForUser = totalReceiverMoney - totalOrder;
    return changeForUser;
  }
  getChange(changeForUser: number): MoneyWallet {
    const userChange: MoneyWallet = new Map();
    const shopWallet = this.shopWallet.money;
    const sortedShopMoneyWallet = Array.from(shopWallet).sort(([left], [right]) => right - left); // Старшие монеты в приоритете

    let restMoneyForChange = changeForUser;

    while (restMoneyForChange !== 0) {
      for (let [moneyId, qty] of sortedShopMoneyWallet) {
        if (moneyId <= restMoneyForChange && qty) {
          if (userChange.has(moneyId)) {
            userChange.set(moneyId, userChange.get(moneyId) + 1);
          } else {
            userChange.set(moneyId, 1);
          }
          restMoneyForChange = restMoneyForChange - moneyId;
          break;
        }
      }
    }
    return userChange;
  }

  withdrawProducts() {
    const reservedProducts = this.reservedProducts.products;
    this.reservedProducts.clear();
    for (let [productId, count] of reservedProducts) {
      this.shopProducts.removeProduct(productId, count);
    }
    return reservedProducts;
  }

  async loadServerData() {
    const [catalogue, shopProducts, shopWallet, receiverWallet] = await Promise.all([
      api.getCatalogue(),
      api.getShopProducts(),
      api.getShopWallet(),
      api.getReceiverWallet(),
    ]);
    this.catalogue = catalogue;
    this.shopProducts.setProducts(shopProducts);
    this.shopWallet.setMoney(shopWallet);
    this.receiverWallet.setMoney(receiverWallet);
  }

  get totalReceiverMoney() {
    return this.receiverWallet.total;
  }

  get totalOrder() {
    const catalogue = this.catalogue;
    const reserverProducts = this.reservedProducts.products;
    return Array.from(reserverProducts).reduce((result, [id, count]) => {
      const { price } = catalogue.find((product) => product.id === id);
      return result + price * count;
    }, 0);
  }
  get canBuy() {
    return this.totalReceiverMoney >= this.totalOrder && this.totalOrder > 0 && this.totalReceiverMoney > 0;
  }
}
