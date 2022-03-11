export type Money = 1 | 2 | 5 | 10 | 50 | 100 | 200 | 500 | 1000;
export type Wallet = Map<Money, number>;

export interface IProduct {
  id: number;
  name: string;
  price: number;
}

export interface IUserProduct {
  id: number;
  name: string;
  count: number;
}

export interface IShopProduct extends IUserProduct {
  price: number;
  reserved: number; //selected
}
