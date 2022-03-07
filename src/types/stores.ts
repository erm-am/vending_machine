export type Money = 1 | 2 | 5 | 10 | 50 | 100 | 200 | 500 | 1000;
export type Wallet = Map<Money, number>;
export interface IUserProduct {
  id: number;
  name: string;
  count: number;
}

export interface IShopProduct {
  id: number;
  name: string;
  count: number;
  price: number;
}

export interface IShopProductDetail {
  name: string;
  qty: number;
  price: number;
}
export interface IUserProductDetail {
  name: string;
  qty: number;
}
export interface ISelectableShopProductDetail extends IShopProductDetail {
  selected: number;
  amount: number;
}
export type UserProducts = Map<number, IUserProductDetail>;
export type ShopProducts = Map<number, IShopProductDetail>;
export type ShopSelectableProducts = Map<number, ISelectableShopProductDetail>;

export type MoneyTransaction = {
  from: Wallet; // Откуда забираем
  to: Wallet; // Куда прибавляем
  payload: Wallet; // Данные для "транзакции"
};
export type ProductTransaction = { from: ShopProducts; to: UserProducts; payload: ShopSelectableProducts };
