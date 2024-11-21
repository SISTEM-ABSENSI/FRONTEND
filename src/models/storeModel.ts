import { IRootModel } from "./rootModel";

export interface IStoreModel extends IRootModel {
    storeId: number
    storeName: string
    storeAddress: string
    storeLongitude: string
    storeLatitude: string
}

export interface IStoreCreateRequestModel {
    storeName: string
    storeAddress: string
    storeLongitude: string
    storeLatitude: string
}

export interface IStoreUpdateRequestModel {
    storeId: string
    storeName?: string
    storeAddress?: string
    storeLongitude?: string
    storeLatitude?: string
}