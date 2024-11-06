import { IRootModel } from "./rootModel";

export interface ISupplierModel extends IRootModel {
    supplierId: number
    supplierName: number
    supplierContact: number
}

export interface ISupplierCreateRequestModel {
    supplierName: string
    supplierContact: string
}

export interface ISupplierUpdateRequestModel {
    supplierId: string
    supplierName?: string
    supplierContact?: string
}