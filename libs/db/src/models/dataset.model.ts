import { BaseModel } from "./base.model"
import { Data } from "./data.model"
import { User } from "./user.model"

export interface Dataset extends BaseModel{
    name: string
    description: string
    creationDate: Date
    lastEditDate: Date
    owner: User
    editors: string[]
    currentVersion: string
    versions: string[]
    data: Data
    linkedDatasets: string[],
    isDriveFile: boolean,
    driveFileId: string,
    mimeType: string
}