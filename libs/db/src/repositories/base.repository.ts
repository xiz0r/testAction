
import * as mongoose from 'mongoose'
import { BaseModel } from '../models/base.model'

/* eslint no-useless-constructor: "off" */
/* eslint-env es6 */
export abstract class BaseRepository<T extends BaseModel> {
  constructor(private readonly model: mongoose.Model<T>) {
  }

  async create(item: T) {
    try {
      return await this.model.create(item)
    } catch (error) {
      throw error
    }
  }

  async insertMany(items: T[]) {
    try {
      return await this.model.insertMany(items)
    } catch (error) {
      throw error
    }
  }

  async update(id: string, item: T): Promise<T> {
    try {
      return await this.model.findOneAndUpdate({ _id: id } as any, item as any, { new: true }).lean()
    } catch (error) {
      throw error
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.deleteOne({ _id: id } as any)
      return !!result //fix
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<T[]> {
    try {
      return await this.model.find().lean()
    } catch (error) {
      throw error
    }
  }

  async findById(id: string): Promise<T> {
    try {
      return await this.model.findById(id).lean()
    } catch (error) {
      throw error
    }
  }

  async findOne(filter: any): Promise<T> {
    try {
      return await this.model.findOne(filter).lean()
    } catch (error) {
      throw error
    }
  }
}
