import { ShopStore } from "./shop";
import { ApiService } from "../api";

export class RootStore {
  shop: ShopStore;
  api: ApiService;
  constructor(api: ApiService) {
    this.api = api;
    this.shop = new ShopStore(this, api);
  }
}
//ui  add() => объект с функции => mobx

export const store = new RootStore(new ApiService());
