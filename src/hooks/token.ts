import { jwtDecode } from "jwt-decode";
import { CONFIGS } from "../configs";
import { IUserTokenModel } from "../models/userModel";

export const useToken = () => {
  const TOKEN_KEY = CONFIGS.localStorageKey;

  const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  };

  const getDecodeUserToken = () => {
    const token = getToken();

    if (token) {
      const resultToken: any = jwtDecode(token);
      const userToken: IUserTokenModel = resultToken;
      return userToken;
    }
    return null;
  };

  const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  };

  const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
  };

  return {
    getDecodeUserToken,
    getToken,
    setToken,
    removeToken,
  };
};
