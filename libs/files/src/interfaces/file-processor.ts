import { Data } from "@app/db/models/data.model"
import { DataDto } from "libs/models/data"

export interface FileProcessorStrategy {
    processFile(buffer: Buffer) : DataDto
}