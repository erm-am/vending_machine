import { setupServer } from "msw/node";
import { VendingMachine, User, Wallet, Products } from "./VendingMachine";
import { shopActions } from ".";
import { apiHandlers } from "../api/server";

export const server = setupServer(...apiHandlers);

describe("wallet (500 руб.)", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  test("Должно быть 500 рублей, если кладем 5 купюр по 100 руб", () => {
    const wallet = new Wallet();
    wallet.setMoney([[100, 5]]);
    expect(wallet.total).toEqual(500);
    expect(wallet.getCount(100)).toEqual(5);
  });

  test("Должно быть 200 рублей, если снимаем 300", () => {
    const wallet = new Wallet();
    wallet.setMoney([[100, 5]]);
    wallet.withdraw(100, 3);
    expect(wallet.total).toEqual(200);
    expect(wallet.getCount(100)).toEqual(2);
  });
});

describe("products (10 шт.)", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  test("Должно быть 10 продуктов c productId 1", () => {
    const products = new Products();
    products.addProduct(1, 10);
    expect(products.hasCount(1, 10)).toBeTruthy();
    expect(products.getCount(1)).toEqual(10);
  });

  test("Должно быть 8 продуктов если убрали 2", () => {
    const products = new Products();
    products.addProduct(1, 10);
    products.removeProduct(1, 2);
    expect(products.hasCount(1, 8)).toBeTruthy();
    expect(products.getCount(1)).toEqual(8);
  });
});
describe("User", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  test("Множественное добавление продуктов в корзину пользователя", () => {
    const user = new User();
    user.bulkDepositProducts(
      new Map([
        [1, 10],
        [2, 10],
      ])
    );
    expect(user.userProducts.getCount(1)).toEqual(10);
    expect(user.userProducts.getCount(2)).toEqual(10);
  });

  test("Множественное добавление денег в кошелек пользователя", () => {
    const user = new User();

    user.bulkDepositMoney(
      new Map([
        [100, 20],
        [200, 30],
        [500, 40],
        [1000, 50],
      ])
    );
    expect(user.userWallet.getCount(100)).toEqual(20);
    expect(user.userWallet.getCount(200)).toEqual(30);
    expect(user.userWallet.getCount(500)).toEqual(40);
    expect(user.userWallet.getCount(1000)).toEqual(50);
  });

  test("Сумма в кошельке пользователя", () => {
    const user = new User();
    user.bulkDepositMoney(
      new Map([
        [100, 1],
        [200, 1],
        [500, 1],
        [1000, 1],
      ])
    );
    expect(user.userWallet.total).toEqual(1800);
  });
  test("Снимаем все деньги с кошелька пользователя", () => {
    const user = new User();
    user.bulkDepositMoney(
      new Map([
        [100, 1],
        [200, 1],
        [500, 1],
        [1000, 1],
      ])
    );
    user.withdrawMoney(100, 1);
    user.withdrawMoney(200, 1);
    user.withdrawMoney(500, 1);
    user.withdrawMoney(1000, 1);
    expect(user.userWallet.total).toEqual(0);
  });
});

describe("VendingMachine", () => {
  test("Расчет сдачи (6 Рублей - 5 рублей + 1 рубль)", () => {
    const vendingMachine = new VendingMachine();
    vendingMachine.bulkDepositMoneyToShop(
      new Map([
        [1, 50],
        [2, 50],
        [5, 50],
        [10, 50],
        [50, 50],
        [100, 50],
        [200, 50],
        [500, 50],
        [1000, 50],
      ])
    );
    expect(vendingMachine.getChange(6).get(5)).toEqual(1);
    expect(vendingMachine.getChange(6).get(1)).toEqual(1);
  });
  test("Расчет сдачи (666 Рублей = 500 рублей + 100 рублей +  50 рублей + 10 рублей + 5 рублей + 1 рубль )", () => {
    const vendingMachine = new VendingMachine();
    vendingMachine.bulkDepositMoneyToShop(
      new Map([
        [1, 50],
        [2, 50],
        [5, 50],
        [10, 50],
        [50, 50],
        [100, 50],
        [200, 50],
        [500, 50],
        [1000, 50],
      ])
    );
    expect(vendingMachine.getChange(666).get(500)).toEqual(1);
    expect(vendingMachine.getChange(666).get(100)).toEqual(1);
    expect(vendingMachine.getChange(666).get(50)).toEqual(1);
    expect(vendingMachine.getChange(666).get(10)).toEqual(1);
    expect(vendingMachine.getChange(666).get(5)).toEqual(1);
    expect(vendingMachine.getChange(666).get(1)).toEqual(1);
  });
  test("Расчет сдачи (10 000 рублей  = 10 по 1000 рублей)", () => {
    const vendingMachine = new VendingMachine();
    vendingMachine.bulkDepositMoneyToShop(
      new Map([
        [1, 50],
        [2, 50],
        [5, 50],
        [10, 50],
        [50, 50],
        [100, 50],
        [200, 50],
        [500, 50],
        [1000, 50],
      ])
    );
    expect(vendingMachine.getChange(10000).get(1000)).toEqual(10);
  });
});
