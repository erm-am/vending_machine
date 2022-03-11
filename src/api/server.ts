import { setupWorker, rest } from "msw";

export const initServer = () => {
  // Кошелек пользователя (наиманование денежной купюры, кол-во)
  const userWallet = [
    [1, 5],
    [2, 5],
    [5, 5],
    [10, 5],
    [50, 5],
    [100, 5],
    [200, 5],
    [500, 5],
    [1000, 5],
  ];

  // Кошелек магазина(касса) (наиманование денежной купюры, кол-во)
  const shopWallet = [
    [1, 50],
    [2, 50],
    [5, 50],
    [10, 50],
    [50, 50],
    [100, 50],
    [200, 50],
    [500, 50],
    [1000, 50],
  ];

  // Кошелек монетоприемника ("предварительная" монетоприемника) (наиманование денежной купюры, кол-во)
  const receiverWallet = [
    [1, 0],
    [2, 0],
    [5, 0],
    [10, 0],
    [50, 0],
    [100, 0],
    [200, 0],
    [500, 0],
    [1000, 0],
  ];

  // Каталог продуктов (справочник)
  const catalogue = [
    { id: 1, name: "Эспрессо", price: 10 },
    { id: 2, name: "Капучино", price: 15 },
    { id: 3, name: "Латте", price: 15 },
    { id: 4, name: "Черный чай", price: 14 },
    { id: 5, name: "Зеленый чай", price: 14 },
    { id: 6, name: "Coca-cola", price: 33 },
    { id: 7, name: "Fanta", price: 34 },
    { id: 8, name: "Pepsi", price: 35 },
    { id: 9, name: "Sprite", price: 36 },
  ];

  // Продукты пользователя (id, кол-во)
  const userProducts = [
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
    [8, 0],
    [9, 0],
  ];

  // Продукты магазина (id, кол-во)
  const shopProducts = [
    [1, 10],
    [2, 10],
    [3, 10],
    [4, 10],
    [5, 10],
    [6, 10],
    [7, 10],
    [8, 10],
    [9, 10],
  ]; // id_продукта + количество

  const worker = setupWorker(
    rest.get("/catalogue", (req, res, ctx) => res(ctx.json(catalogue))),
    rest.get("/userWallet", (req, res, ctx) => res(ctx.json(userWallet))),
    rest.get("/shopWallet", (req, res, ctx) => res(ctx.json(shopWallet))),
    rest.get("/receiverWallet", (req, res, ctx) => res(ctx.json(receiverWallet))),
    rest.get("/userProducts", (req, res, ctx) => res(ctx.json(userProducts))),
    rest.get("/shopProducts", (req, res, ctx) => res(ctx.json(shopProducts)))
  );
  worker.start();
};
