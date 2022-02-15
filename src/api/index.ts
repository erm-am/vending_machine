import { Wallet, UserProducts, ShopProducts } from "../types/stores";

const userWalletFakeData: Wallet = new Map([
  [1, 5],
  [2, 5],
  [5, 5],
  [10, 5],
  [50, 5],
  [100, 5],
  [200, 5],
  [500, 5],
]);
const shopWalletFakeData: Wallet = new Map([
  [1, 50],
  [2, 50],
  [5, 50],
  [10, 50],
  [50, 50],
  [100, 50],
  [200, 50],
  [500, 50],
]);
const receiverWalletFakeData: Wallet = new Map([
  [1, 0],
  [2, 0],
  [5, 0],
  [10, 0],
  [50, 0],
  [100, 0],
  [200, 0],
  [500, 0],
]);
const shopProductsFakeData: ShopProducts = new Map([
  [1, { qty: 20, price: 10, name: "Кофе" }],
  [2, { qty: 20, price: 10, name: "Чай" }],
  [3, { qty: 20, price: 10, name: "Шоколадка" }],
  [4, { qty: 20, price: 10, name: "Конфета" }],
  [5, { qty: 20, price: 10, name: "Pepsi" }],
  [6, { qty: 20, price: 10, name: "Coca-cola" }],
  [7, { qty: 20, price: 10, name: "Конфета111" }],
  [8, { qty: 20, price: 10, name: "Pepsi222" }],
  [9, { qty: 20, price: 10, name: "Coca-cola333" }],
]);

const userProductsFakeData: UserProducts = new Map([
  [1, { qty: 0, name: "Кофе" }],
  [2, { qty: 0, name: "Чай" }],
  [3, { qty: 0, name: "Шоколадка" }],
  [4, { qty: 0, name: "Конфета" }],
  [5, { qty: 0, name: "Pepsi" }],
  [6, { qty: 0, name: "Coca-cola" }],
  [7, { qty: 0, name: "Конфета111" }],
  [8, { qty: 0, name: "Pepsi222" }],
  [9, { qty: 0, name: "Coca-cola333" }],
]);

export class ApiService {
  async getUserWallet() {
    return userWalletFakeData;
  }
  async getShopWallet() {
    return shopWalletFakeData;
  }
  async getShopProducts() {
    return shopProductsFakeData;
  }
  async getUserProducts() {
    return userProductsFakeData;
  }
  async getReceiverWallet() {
    return receiverWalletFakeData;
  }
}
