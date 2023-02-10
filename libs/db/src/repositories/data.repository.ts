import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Data } from '../models/data.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class DataRepository extends BaseRepository<Data> {
    constructor(
        @InjectModel('Data')
        private readonly dataModel: Model<Data>,
    ) {
        super(dataModel)
    }

    async create(payload: Partial<Data>) {
        const data = {
            data: this.addObectIdToData(payload.data),
            schema: payload.schema,
            date: Date.now(),
            datasetId: payload.datasetId
        }
        return await this.dataModel.create(data)
    }

    async deleteByDatasetId (datasetId: string) {
        return await this.dataModel.deleteMany({ datasetId: datasetId})
    }

    private addObectIdToData(data: any): any {
        const datawithIds = data.map((d) => {
            return { ...d, _id: new mongoose.Types.ObjectId() }
        });
        return datawithIds
    }

}