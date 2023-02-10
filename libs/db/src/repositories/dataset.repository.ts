import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DataDto } from 'libs/models/data';
import mongoose, { Model } from 'mongoose';
import { Dataset } from '../models/dataset.model';
import { generatePipeline } from '../utils/pipeline.generator';
import { BaseRepository } from './base.repository';
import { DataRepository } from './data.repository';

@Injectable()
export class DatasetRepository extends BaseRepository<Dataset> {
  constructor(
    @InjectModel('Dataset') private readonly datasetModel: Model<Dataset>,
    private readonly dataRepository: DataRepository,
  ) {
    super(datasetModel)
  }

  async findById(id: string): Promise<Dataset> {
    const dataset = await this.datasetModel.findById(id).populate('owner').populate({ path: 'editors', model: 'User', select: '-_id email' })
    if(dataset.currentVersion){
      const data = await this.dataRepository.findById(dataset.currentVersion)
      const pipeline = generatePipeline(data.schema, id)
      const response = await this.datasetModel.aggregate(pipeline)
      const retDataset = await this.datasetModel.populate(response[0], { path: 'owner editors', model: 'User', select: '-_id email' })
      return retDataset
    } else {
      return dataset
    }
  }

  async findByIdWithSpecificData(datasetId: string, dataId: string): Promise<Dataset> {
    const dataset = await this.datasetModel.findById(datasetId).populate('owner').populate({ path: 'editors', model: 'User', select: '-_id email' })
    if(dataset.versions.indexOf(dataId) > -1){
      const data = await this.dataRepository.findById(dataId)
      const pipeline = generatePipeline(data.schema, datasetId, dataId)
      const response = await this.datasetModel.aggregate(pipeline)
      const dataset = await this.datasetModel.populate(response[0], { path: 'owner editors', model: 'User', select: '-_id email' })
      return dataset
    } else {
      throw new BadRequestException('This data id does not belong to that dataset.')
    }
  }

  async getAll(userId: string): Promise<Dataset[]> {
    return await this.datasetModel.find({ $or: [{ owner: userId }, { editors: userId }] }).populate('owner').populate({ path: 'editors', model: 'User', select: '-_id email' }).lean()
  }

  async updateVersion(payload: DataDto): Promise<Dataset> {
    const data = await this.dataRepository.create(payload)
    const updatedDataset = this.datasetModel.findOneAndUpdate(
      { _id: payload.datasetId }, {
      currentVersion: data._id,
      lastEditDate: new Date(),
      "$push": { "versions": data._id }
    }, {
      new: true
    }
    )
    return await updatedDataset
  }

  async updateLinkedDatasets(datasetId: string, linkedDatasetId: string): Promise<Dataset> {
    const updatedDataset = this.datasetModel.findOneAndUpdate(
      { _id: datasetId }, {
      "$push": { "linkedDatasets": linkedDatasetId }
    }, {
      new: true
    }
    )
    return await updatedDataset
  }
}