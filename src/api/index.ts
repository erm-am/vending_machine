import { Money, IProduct } from "../types";

import { axiosInstance as api } from "./axios";

export const getCatalogue = () => api.get<IProduct[], any>(`/catalogue`);
export const getUserWallet = () => api.get<[Money, number][], any>(`/userWallet`);
export const getShopWallet = () => api.get<[Money, number][], any>(`/shopWallet`);
export const getReceiverWallet = () => api.get<[Money, number][], any>(`/receiverWallet`);
export const getUserProducts = () => api.get<[number, number][], any>(`/userProducts`);
export const getShopProducts = () => api.get<[number, number][], any>(`/shopProducts`);
