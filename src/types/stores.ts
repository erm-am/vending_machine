export type Money = 1 | 2 | 5 | 10 | 50 | 100 | 200 | 500 | 1000;
export type MoneyWallet = Map<Money, number>;
export type Products = Map<number, number>;

export interface IProduct {
  id: number;
  name: string;
  price: number;
}
