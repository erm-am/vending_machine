import { setupServer } from "msw/node";
import { VendingMachine, User, Wallet, Products } from "./VendingMachine";

import { apiHandlers } from "../api/server";

export const server = setupServer(...apiHandlers);

describe("wallet", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  test("Возможность внесения денег", () => {
    const wallet = new Wallet();
    wallet.bulkAddMoney([[100, 5]]);
    expect(wallet.total).toEqual(500);
    expect(wallet.getCount(100)).toEqual(5);
  });

  test("Возможность внесения и снятия денег", () => {
    const wallet = new Wallet();
    wallet.bulkAddMoney([[100, 5]]);
    wallet.withdraw(100, 3);
    expect(wallet.total).toEqual(200);
    expect(wallet.getCount(100)).toEqual(2);
  });
});

describe("Products", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  test("Возможность добавления продуктов", () => {
    const products = new Products();
    products.addProduct(1, 10);
    expect(products.hasCount(1, 10)).toBeTruthy();
    expect(products.getCount(1)).toEqual(10);
  });

  test("Возможность добавления и удаления продуктов", () => {
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
  test("Возможность множественного добавления продуктов", () => {
    const user = new User();
    user.bulkAddProducts(
      new Map([
        [1, 10],
        [2, 10],
      ])
    );
    expect(user.userProducts.getCount(1)).toEqual(10);
    expect(user.userProducts.getCount(2)).toEqual(10);
  });

  test("Возможность множественного добавления денег в кошелек пользователя", () => {
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

  test("Подсчет итоговой суммы в кошельке пользователя", () => {
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
  test("Возможность множественного снятия денег с кошелька пользователя", () => {
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
  test("Расчет сдачи на основе заданного значения (запрашиваем:6;получаем:5,1)", () => {
    const vendingMachine = new VendingMachine();
    vendingMachine.depositMoneyInShop(
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
  test("Расчет сдачи на основе заданного значения (запрашиваем:666;получаем:500,100,50,10,5,1)", () => {
    const vendingMachine = new VendingMachine();
    vendingMachine.depositMoneyInShop(
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
  test("Расчет сдачи на основе заданного значения (запрашиваем:1;получаем:1)", () => {
    const vendingMachine = new VendingMachine();
    vendingMachine.depositMoneyInShop(
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
    expect(vendingMachine.getChange(1).get(1)).toEqual(1);
  });
});
