import { DataDto } from "./data"

export interface DatasetDto {
    _id?: string
    name: string
    description: string
    creationDate?: Date
    lastEditDate?: Date
    linkedDatasets: string[]
    owner: string
    editors?: string[]
    currentVersion?: string
    versions?: string[]
    data?: DataDto
    isDriveFile?: boolean,
    driveFileId?: string
    mimeType?: string
}