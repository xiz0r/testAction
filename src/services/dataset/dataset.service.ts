import { Data } from '@app/db/models/data.model';
import { Dataset } from '@app/db/models/dataset.model';
import { DataRepository } from '@app/db/repositories/data.repository';
import { DatasetRepository } from '@app/db/repositories/dataset.repository';
import { UserRepository } from '@app/db/repositories/user.repository';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DataDto } from 'libs/models/data';
import { DatasetDto } from 'libs/models/dataset';
import { UserDto } from 'libs/models/user';
import { ReferenceObject } from 'libs/models/reference-object'
import { datasetAdapter } from 'src/adapters/dataset.adapter';
import { isAnObjectReference } from 'src/utils/utils'
const util = require('util')

@Injectable()
export class DatasetService {
    constructor(
        private readonly datasetRepository: DatasetRepository,
        private readonly dataRepository: DataRepository,
        private readonly userRepository: UserRepository
    ) { }

    async getById(id: string): Promise<DatasetDto> {
        try {
            const dataset = await this.datasetRepository.findById(id)
            return  datasetAdapter(dataset)
        } catch {
            throw new NotFoundException('There are no datasets with that id')
        }
    }

    async getByUser(email: string): Promise<DatasetDto[]> {
        try {
            const user = await this.userRepository.findOne({ email })
            return (await this.datasetRepository.getAll(user._id)).map((dataset) => {
                return datasetAdapter(dataset)})
        } catch (error) { 
            console.error(error)
            throw new BadRequestException('Invalid user')
        }
    }

    async getDataVersion(datasetId: string, dataId: string): Promise<DatasetDto> {
        try {
            const dataset = await this.datasetRepository.findByIdWithSpecificData(datasetId, dataId)
            return  datasetAdapter(dataset)
        } catch {
            throw new BadRequestException('Invalid dataset id')
        }
    }

    async create(dataset: DatasetDto): Promise<DatasetDto> {
        const user = await this.userRepository.findOne({ email: dataset.owner })
        if (!user) throw new NotFoundException('Invalid owner')
        if (!dataset.name || !dataset.name.length) throw new BadRequestException('Invalid name')
        const createDataset = { ...dataset, owner: user._id, editors: dataset.editors ? await this.getEditors(dataset.editors) : [], creationDate: new Date(), lastEditDate: new Date() }
        try {
            const createdDataset = await this.datasetRepository.create(createDataset as Dataset);
            if (dataset.data) {
                if (dataset.data.schema) {
                    //check if the dataset has referenced values
                    const references = Object.values(dataset.data.schema).filter((value: any) => {
                        if (value instanceof Object) return isAnObjectReference(value)
                    })
                    //if the dataset has referenced values, update the datasets that it will be linked with
                    if (references.length) {
                        references.forEach(async (reference: ReferenceObject) => {
                            const linkedData = await this.dataRepository.findById(reference.reference)
                            const linkedDataset = await this.datasetRepository.findById(linkedData.datasetId)
                            await this.datasetRepository.updateLinkedDatasets(linkedDataset._id, createdDataset._id)
                        })
                    }
                }
                const createdData = await this.dataRepository.create({ ...dataset.data, datasetId: createdDataset._id })
                const updatedDataset = await this.datasetRepository.update(createdDataset._id, { ...createdDataset.toObject(), currentVersion: createdData._id, versions: [createdData._id] } as Dataset)
                return datasetAdapter(updatedDataset)
            } else {
                return datasetAdapter(createdDataset)
            }
        } catch (error) {
            throw new BadRequestException('Error creating dataset')
        }
    }

    async updateVersion(data: DataDto): Promise<DatasetDto> {
        try {
            return datasetAdapter(await this.datasetRepository.updateVersion(data as Data))
        } catch (error) {
            throw new BadRequestException('Error updating data')
        }
    }

    async getEditors(editors: string[]): Promise<string[]> {
        try {
            const editorsId = editors.map((email) => {
                return new Promise((resolve) => {
                    resolve(this.userRepository.findOne({ email }))
                })
            })
            return await Promise.all(editorsId).then((response: any) => {
                return response.map((user: UserDto) => {
                    return user._id
                })
            })
        } catch (error) {
            throw new BadRequestException(`Invalid editor`)
        }
    }

    async delete(id: string) {
        const dataset = await this.datasetRepository.findById(id)
        if(dataset.linkedDatasets.length > 0){
            throw new ConflictException('This dataset has linked data and it cannot be deleted.')
        } else {
            try {
                await this.dataRepository.deleteByDatasetId(id)
                return await this.datasetRepository.delete(id)
            } catch {
                throw new BadRequestException('There was an error while deleting the data')
            }
        }
    }
}
