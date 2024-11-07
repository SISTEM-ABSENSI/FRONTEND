import { IRootModel } from "./rootModel";

export interface IUserModel extends IRootModel {
  userId: string
  userName: string
  userEmail: string
  userPassword: string
  userRole: 'admin' | 'spg' | 'supplier'
  userDeviceId: string
  userContact: string
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
  userContact: string;
  userPassword: string;
  userRole: "admin" | "superAdmin" | "supplier" | string;
}

export interface IUserUpdateRequestModel {
  userId: string
  userName?: string
  userEmail?: string
  userPassword?: string
  userRole?: 'admin' | 'superAdmin' | 'spg' | 'supplier' | string
  userDeviceId?: string
  userContact?: string
}