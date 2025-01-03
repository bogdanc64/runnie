import { Model } from "../models/model";
import { Response } from "../models/data";
import { DataService } from "./data.service";

export interface IBaseService<T> {
    get(id:number): Promise<Response<T>>;
    list(): Promise<Response<T[]>>;
    create(entity: T): Promise<Response<T>>;
    update(entity: T): Promise<Response<T>>;
    delete(id: number): Promise<Response<boolean>>;
}

export abstract class BaseService<T extends Model> implements IBaseService<T> {

    protected path: string;
    protected baseDataService: DataService;

    constructor(path: string, dataService: DataService) {
        this.path = path;
        this.baseDataService = dataService;
    }

    public get(id: number): Promise<Response<T>> {
        return this.baseDataService.get(this.path, id) as Promise<Response<T>>;        
    }
    
    public list(): Promise<Response<T[]>> {
        return this.baseDataService.list(this.path) as Promise<Response<T[]>>;
    }

    public create(entity: T): Promise<Response<T>> {
        return this.baseDataService.create(this.path, entity) as Promise<Response<T>>;
    }

    public update(entity: T): Promise<Response<T>> {
        return this.baseDataService.update(this.path, entity) as Promise<Response<T>>;
    }
    
    public delete(id: number): Promise<Response<boolean>> {
        return this.baseDataService.delete(this.path, id);
    }

}