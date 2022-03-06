import { VendingMachine } from "./../../pages/VendingMachine/index";
import { ShopStore } from "./index";
import { makeObservable, observable, computed, action, toJS, runInAction } from "mobx";
import { Wallet, Money, UserProducts } from "../../types/stores";

//VendingMachine
class Products {
  private products: Map<string, number>;

  // Есть ли нужное число продукта
  hasCount(productId: string, count: number): boolean {
    return this.getCount(productId) === count;
  }

  getCount(productId: string): number {
    return this.products.get(productId) ?? 0;
  }

  add(productId: string) {
    if (!this.products.has(productId)) {
      this.products.set(productId, 0);
    }
    const currentCount = this.products.get(productId);
    this.products.set(productId, currentCount + 1);
  }
}
// userProducts =  new Products([1,1,1,1])
// shopProducts =  new Products([0,0,0,0])

class Cash {
  //monney

  private money: Map<number, number>;
  getCount(moneyId: number): number {
    return this.money.get(moneyId) ?? 0;
    //
  }

  withdraw(moneyId: number, count: number): number {
    //hasMoneyAvailable !
    const currentMoney = this.getCount(moneyId);
    const result = Math.max(0, currentMoney - count);
    this.money.set(moneyId, result);
    return result;
  }

  deposit(moneyId: number, count: number): number {
    const currentMoney = this.getCount(moneyId);
    const result = currentMoney + count;
    this.money.set(moneyId, result);
    return result;
  }
}

class User {
  private wallet: Cash;

  hasMoneyAvailable(moneyId: number): boolean {
    return this.wallet.getCount(moneyId) > 0;
  }

  withdrawMoney(moneyId: number) {
    if (this.hasMoneyAvailable(moneyId)) {
      this.wallet.withdraw(moneyId, 1);
    }
  }
  depositMoney(moneyId: number) {
    this.wallet.deposit(moneyId, 1);
  }

  //
}

class VendingMachine {
  private availableProducts: Products; // продукты доступные(нахоядтся в самом аппарате)
  private cashDesk: Cash; // деньги внутри автомата (касса)
  private userCart: Products; // выбранные продукты юзера
  private depositedMoney: Cash; // внесенные деньги юзером (монетоприемник)

  getDepositedMoney() {
    return this.depositedMoney;
  }
  //global vending
  hasProductAvailable(productId: string): boolean {
    // можно ил доабвить продукт?
    const alreadyAddedCount = this.userCart.getCount(productId); //уже добавлено
    return this.availableProducts.hasCount(productId, 1 + alreadyAddedCount);
  }

  // Добавляет в корзину продукт
  // Возвращает кол-во продуктов, котоыре есть в корзине
  addProduct(productId: string): number {
    if (this.hasProductAvailable(productId)) {
      this.userCart.add(productId);
    }
    return this.userCart.getCount(productId);
  }
}

// Внести деньги пользователя в продуктовый аппарат

// Внести деньги пользователя в продуктовый аппарат
function cashInsert({ user, moneyId, vending }: { user: User; moneyId: number; vending: VendingMachine }) {
  if (user.hasMoneyAvailable(moneyId)) {
    user.withdrawMoney(moneyId); //снимает деньги
    vending.getDepositedMoney().deposit(moneyId, 1); // Закидываем в монетоприемник
    //
  } else {
    throw new Error("нет денег");
  }
}

//vending - store
//user
function productAdd({ productId, vending }: { productId: string; vending: VendingMachine }) {
  if (vending.hasProductAvailable(productId)) {
    vending.addProduct(productId);
  } else {
    console.log("такого продукта нет error");
    throw new Error("такого продукта нет error");
  }
}

export class UserStore {
  shopStore: ShopStore;
  userProducts: UserProducts = new Map();
  userWallet: Wallet = new Map();
  constructor(shopStore: ShopStore) {
    makeObservable(this, {
      userProducts: observable,
      userWallet: observable,
      totalUserMoney: computed,
      transferUserMoneyToVendingMachine: action,
    });
    this.shopStore = shopStore;
  }

  transferUserMoneyToVendingMachine(moneyId: Money, currentQty) {
    if (!currentQty) {
      return;
    }
    this.shopStore.moneyTransaction({
      from: this.userWallet,
      to: this.shopStore.vendingMachineStore.receiverWallet,
      payload: new Map([[moneyId, 1]]),
    });
  }

  get totalUserMoney() {
    const total = Array.from(this.userWallet).reduce((result, [moneyId, qty]) => result + qty * moneyId, 0);
    return total;
  }
}
