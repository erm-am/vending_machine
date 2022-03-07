import { Wallet, UserProducts, ShopProducts, IUserProduct, IShopProduct, Money } from "../types/stores";
import { setupWorker, rest } from "msw";
import { initServer } from "./server";
initServer(); // fake server

import { axiosInstance as api } from "./axios";

export const getUserWallet = () => api.get<[Money, number][], any>(`/userWallet`);
export const getShopWallet = () => api.get<[Money, number][], any>(`/shopWallet`);
export const getReceiverWallet = () => api.get<[Money, number][], any>(`/receiverWallet`);
export const getUserProducts = () => api.get<IUserProduct[], any>(`/userProducts`);
export const getShopProducts = () => api.get<IShopProduct[], any>(`/shopProducts`);
