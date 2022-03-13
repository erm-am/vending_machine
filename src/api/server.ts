import { setupWorker, rest } from "msw";
import { catalogue, userWallet, shopWallet, receiverWallet, userProducts, shopProducts } from "./mocks";
export const apiHandlers = [
  rest.get("/catalogue", (req, res, ctx) => res(ctx.json(catalogue))),
  rest.get("/userWallet", (req, res, ctx) => res(ctx.json(userWallet))),
  rest.get("/shopWallet", (req, res, ctx) => res(ctx.json(shopWallet))),
  rest.get("/receiverWallet", (req, res, ctx) => res(ctx.json(receiverWallet))),
  rest.get("/userProducts", (req, res, ctx) => res(ctx.json(userProducts))),
  rest.get("/shopProducts", (req, res, ctx) => res(ctx.json(shopProducts))),
];
export const initApiWorker = () => {
  const worker = setupWorker(...apiHandlers);
  worker.start();
};
