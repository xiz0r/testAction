import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { Mimetypes } from 'libs/models/mime-types';
import { FileProcessorStrategy } from './interfaces/file-processor';
import { CsvStrategy } from './processors/csv';
import { ExcelStrategy } from './processors/excel';
import { JsonStrategy } from './processors/json';
import { DataDto } from 'libs/models/data';

@Injectable()
export class FilesService {
    private processorStrategy: FileProcessorStrategy
    constructor() {
        this.processorStrategy = null
    }

    public generateData(buffer: Buffer, mimeType: string): DataDto {
        let data: DataDto
        switch (mimeType) {
            case Mimetypes.OpenXML:
                this.processorStrategy = new ExcelStrategy()
                break
            case Mimetypes.GoogleSheets:
                this.processorStrategy = new ExcelStrategy()
                break
            case Mimetypes.Json:
                this.processorStrategy = new JsonStrategy()
                break
            case Mimetypes.Csv:
                this.processorStrategy = new CsvStrategy()
                break
        }
        const processedData = this.processorStrategy.processFile(buffer)
        data = { ...data, data: this.addObectIdToData(processedData) }
        const schema = this.getSchema(data)
        data = { ...data, schema: schema }
        return data
    }

    private getSchema(data: DataDto) {
        let keys = Object.keys(data?.data[0])
        let values = Object.values(data?.data[0])
        let types = values.map((v) => {
            return typeof v
        })
        let schema: any = {}
        keys.forEach((key, index) => {
            schema[key] = types[index]
        })
        return schema
    }

    private addObectIdToData(data: any): any {
        const datawithIds = data.map((d) => {
            return { ...d, _id: new mongoose.Types.ObjectId() }
        });
        return datawithIds
    }
}
