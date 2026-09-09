import { Model } from 'mongoose';
import { BaseRepository } from '../base.repository';

export abstract class MongooseBaseRepository<T> extends BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {
    super();
  }

  async findById(id: string): Promise<T | null> {
    return (await this.model.findById(id).exec()) as T | null;
  }

  async findAll(): Promise<T[]> {
    return (await this.model.find({}).exec()) as T[];
  }

  async create(data: Partial<T>): Promise<T> {
    const [createdEntity] = await this.model.create([data]);
    return createdEntity as T;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const document = await this.model.findById(id);
    if (!document) {
      return null;
    }
    document.set(data);
    return (await document.save()) as T;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
