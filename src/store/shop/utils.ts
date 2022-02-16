import { Money } from "./../../types/stores";
import { IRow } from "../../components/core/Grid";
import { Wallet } from "../../types/stores";

export const convertShopAndReceiverWalletsToGridData = (storeReceiverWallet: Wallet, storeShopWallet: Wallet): IRow[] => {
  const receiverWallet = Array.from(storeReceiverWallet);
  const shopWallet = Array.from(storeShopWallet);
  const result = receiverWallet.map((receiverWalletMoney, index) => {
    const [money_id, receiverWalletMoneyQty] = receiverWalletMoney;
    const [, shopWalletMoneyQty] = shopWallet[index];
    return { name: money_id, receiverWalletMoneyQty, shopWalletMoneyQty };
  });
  return result;
};
