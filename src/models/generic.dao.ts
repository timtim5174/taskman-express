export interface GenericDAO <T> {
    
    create(entity: Partial<T>): Promise<T>
    findAll(entityFilter?: Partial<T>): Promise<T[]>;
    update(entity: Partial<T>): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    findOne(entityFilter: Partial<T>): Promise<T | null>;
}