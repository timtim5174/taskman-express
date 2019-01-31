import { Db } from 'mongodb';
import uuidv4 from 'uuid/v4';
import { Entity } from './entity';
import { GenericDAO } from './generic.dao';

export class MongoGenericDAO<T extends Entity> implements GenericDAO<T> {
  constructor(private db: Db, private collection: string) { }

  public async create(entity: Partial<T>) {
    entity.id = uuidv4();
    entity.createdAt = new Date().getTime();
    const result = await this.db.collection(this.collection).insertOne(entity);
    return entity as T; 
  }

  public async findAll(entityFilter?: Partial<T>) {
    return this.db.collection(this.collection)
      .find(entityFilter)
      .sort({ createdAt: -1 })
      .toArray();
  }

  public async update(entity: Partial<T>) {
    const result = await this.db.collection(this.collection).updateOne({ id: entity.id }, { $set: entity });
    return !!result.modifiedCount;
  }

  public async delete(id: string) {
    const result = await this.db.collection(this.collection).deleteOne({ id });
    return !!result.deletedCount;
  }

  public async findOne(entityFilter: Partial<T>) {
    return this.db.collection(this.collection).findOne(entityFilter as object);
}
}

