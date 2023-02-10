import { DataDto } from "libs/models/data";
import { FileProcessorStrategy } from "../interfaces/file-processor";
import { keysToLowerCase } from "../utils/utils";
const XLSX = require("xlsx")

export class ExcelStrategy implements FileProcessorStrategy {
    processFile(buffer: Buffer): DataDto {
        const data = XLSX.read(buffer)
        let finalObject: any = [];
        data.SheetNames.forEach(sheetName => {
            let rowObject = XLSX.utils.sheet_to_json(data.Sheets[sheetName]);
            finalObject = rowObject
        });
        return keysToLowerCase(finalObject)
    }
}