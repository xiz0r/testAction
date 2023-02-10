import { BaseModel } from "./base.model"

export interface Data extends BaseModel {
    datasetId: string
    data: any
    date: Date
    schema: any
}