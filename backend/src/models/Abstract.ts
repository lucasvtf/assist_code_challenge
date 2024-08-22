import { model, Model, models, Schema } from 'mongoose';

export default class ModelExample<T> {
  protected model: Model<T>;
  protected schema: Schema;
  protected modelName: string;

  constructor(schema: Schema, modelName: string) {
    this.schema = schema;
    this.modelName = modelName;
    this.model = models[this.modelName] || model(this.modelName, schema);
  }

  public async create(item: T): Promise<T> {
    return this.model.create(item);
  }

  public async findAll(): Promise<T[]> {
    return this.model.find();
  }

  public async find(query: object): Promise<T[]> {
    return this.model.find(query);
  }

  public async findOne(query: object): Promise<T | null> {
    return this.model.findOne(query);
  }
  public async findById(_id: string): Promise<T | null> {
    return this.model.findById(_id);
  }

  public async update(_id: string, update: object): Promise<void> {
    await this.model.updateOne({ _id }, update);
  }

  public async delete(_id: string): Promise<void> {
    await this.model.deleteOne({ _id });
  }
}
