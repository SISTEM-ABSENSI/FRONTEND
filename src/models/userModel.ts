import { IRootModel } from "./rootModel";

export interface IUserModel extends IRootModel {
  userId: string;
  userName: string;
  userEmail: string;
  userPassword: string;
  userRole: "admin" | "superAdmin";
}

export interface IUserLoginRequestModel {
  userName: string;
  userPassword: string;
}

export interface IUserTokenModel {
  userName: string;
  userId: string;
  userRole: "ADMIN" | "USER";
}

export interface IUserCreateRequestModel {
  userName: string;
  userEmail: string;
  userPassword: string;
  userRole: "admin" | "superAdmin";
}
