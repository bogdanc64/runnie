import { Model } from "../models/model";
import { DataService } from "./data.service";

export interface IBaseService<T> {
    get(id:number): Promise<T>;
    list(): Promise<T[]>;
    create(entity: T): Promise<T>;
    update(entity: T, id?: number): Promise<T>;
    delete(id: number): Promise<boolean>;
}

export abstract class BaseService<T extends Model> implements IBaseService<T> {

    protected path: string;
    protected baseDataService: DataService;

    constructor(path: string, private readonly name: string, dataService: DataService) {
        this.path = path;
        this.baseDataService = dataService;
    }

    public get(id: number): Promise<T> {
        return this.baseDataService.get(this.path, id) as Promise<T>;        
    }
    
    public list(): Promise<T[]> {
        return this.baseDataService.list(this.path) as Promise<T[]>;
    }
    
    public create(entity: T): Promise<T> {
        const data = { 
            [this.name]:  entity
        };
        return (this.baseDataService.create(this.path, data) as any) as Promise<T>;   
    }
    
    public update(entity: T): Promise<T> {
        const data = { 
            [this.name]:  entity
        };
        return this.baseDataService.update(this.path, data, entity.id) as Promise<T>;
    }
    
    public delete(id: number): Promise<boolean> {
        return this.baseDataService.delete(this.path, id).then((v)=> !!v);
    }

}