export interface IDataService {
    upload: (path: string, data: any, id?: number, opts?: CRUDOptions) => Promise<any>;
    uploadFile: (path: string, data: any) => Promise<any>;
    get: (path: string, id?: number) => Promise<any>;
    list: (path: string, id?: number) => Promise<any>;
    upsert: (path: string, entity: any) => Promise<any>;
    delete: (path: string, id?: number) => Promise<any>;
    getRaw: (path: string, id?: number) => Promise<any>;
    getBinary: (path: string, id?: number) => Promise<any>;
    authMethod: (path: string, entity: any, opts: CRUDOptions) => Promise<any>;
    apiUrl: string | undefined;
}

export interface CRUDOptions {
    contentType?: string;
    method?: string;
}

export interface Response<T> {
    meta?: any;
    data: T | null;
    status: number;
}

export enum HttpStatusCodes {
    OK = 200,
    CREATED = 201,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403
}

export enum HttpMethods {
    GET = "get",
    DELETE = "delete",
    PATCH = "patch",
    PUT = "put",
    POST = "post"
}

export enum ContentTypes {
    JSON = "application/json",
    Sheet = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
}