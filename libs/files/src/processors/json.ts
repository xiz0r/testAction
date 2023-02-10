import { DataDto } from "libs/models/data"
import { FileProcessorStrategy } from "../interfaces/file-processor"
import { keysToLowerCase } from "../utils/utils"

export class JsonStrategy implements FileProcessorStrategy {
    processFile(buffer: Buffer): DataDto {
        const data = JSON.parse(buffer.toString())
        return keysToLowerCase(data)
    }
}