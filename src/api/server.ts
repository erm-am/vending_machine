import { setupWorker, rest } from "msw";

export const initServer = () => {
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
  const products = [
    { id: 1, name: "Эспрессо" },
    { id: 2, name: "Капучино" },
    { id: 3, name: "Латте" },
    { id: 4, name: "Черный чай" },
    { id: 5, name: "Зеленый чай" },
    { id: 6, name: "Coca-cola" },
    { id: 7, name: "Fanta" },
    { id: 8, name: "Pepsi" },
    { id: 9, name: "Sprite" },
  ];

  const userProducts = products.map((product) => ({ ...product, count: 0 }));
  const shopProducts = products.map((product) => ({ ...product, count: 10, price: 12, reserved: 0 }));

  const worker = setupWorker(
    rest.get("/userWallet", (req, res, ctx) => res(ctx.json(userWallet))),
    rest.get("/shopWallet", (req, res, ctx) => res(ctx.json(shopWallet))),
    rest.get("/receiverWallet", (req, res, ctx) => res(ctx.json(receiverWallet))),
    rest.get("/userProducts", (req, res, ctx) => res(ctx.json(userProducts))),
    rest.get("/shopProducts", (req, res, ctx) => res(ctx.json(shopProducts)))
  );
  worker.start();
};
