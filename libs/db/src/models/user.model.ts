import { BaseModel } from "./base.model"

export interface User extends BaseModel {
    name: string
    familyName: string
    email: string
}