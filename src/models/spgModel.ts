import { IRootModel } from "./rootModel";

export interface ISpgModel extends IRootModel {
    userId: string
    userName: string
    userEmail: string
    userDeviceId: string
    userContact: string
}
