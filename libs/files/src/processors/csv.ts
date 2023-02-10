import { DataDto } from "libs/models/data"
import { FileProcessorStrategy } from "../interfaces/file-processor"

export class CsvStrategy implements FileProcessorStrategy {
    processFile(buffer: Buffer): DataDto {
        const csv = buffer.toString()
        const lines = csv.split("\n")
        const cleanedLines = lines.map((line) => {
            return line.replace('\r', '')
        })
        const headers = cleanedLines[0].split(",")

        let results: any = []
        for (let i = 1; i < cleanedLines.length; i++) {
            let obj = {};
            let currentline = cleanedLines[i].split(",")
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j].toLowerCase()] = currentline[j]
            }
            results.push(obj)
        }
        return results
    }
}