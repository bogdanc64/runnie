import { IDataService, CRUDOptions, HttpMethods, ContentTypes } from "../models/data";

export interface Response<T> {
    meta?: any;
    data: T | null;
    status: number;
}

export class DataService implements IDataService {
    public apiUrl: string | undefined;
    private readonly headers: { [key: string]: string } = {};

    constructor(apiUrl?: string) {
        if (!apiUrl) return;

        this.apiUrl = apiUrl;
    }

    public async getBinary(path: string, id?: number): Promise<Response<any>> {
        const url = id ? `${this.cleanPath(path)}/${id}` : this.cleanPath(path);
        
        return this.request(url, {
            method: HttpMethods.GET,
            opts: { contentType: ContentTypes.JSON },
            isBinary: true,
        });
    }

    public async get(path: string, id?: number): Promise<Response<any>  > {
        const url = id
            ? `${this.cleanPath(path)}/${id}`
            : `${this.cleanPath(path)}`;

        return this.request(url, {
            method: HttpMethods.GET,
            opts: { contentType: ContentTypes.JSON },
        });
    }

    public async list(path: string, id?: number): Promise<Response<any>> {
        const url = id ? `${this.cleanPath(path)}/${id}` : this.cleanPath(path);
        
        return this.request(url, {
            method: HttpMethods.GET,
            opts: { contentType: ContentTypes.JSON },
        });
    }

    public async authMethod(path: string, entity: any, opts: CRUDOptions): Promise<Response<any>> {
        const url = this.cleanPath(path);
        
        return this.request(url, {
            method: opts.method as HttpMethods,
            opts: opts,
            body: entity ? JSON.stringify(entity) : null,
        });
    }

    public async upsert(path: string, entity: any, withFile?: boolean): Promise<Response<any>> {
        const url = `${this.cleanPath(path)}/upsert`;
        let body: string | FormData;
        
        if (withFile) {
            body = Object.keys(entity).reduce((fd, field) => {
                fd.append(field, entity[field]);
                return fd;
            }, new FormData());
        } else {
            body = JSON.stringify(entity);
        }
        
        return this.request(url, {
            method: HttpMethods.POST,
            opts: { contentType: withFile ? undefined : ContentTypes.JSON },
            body,
        });
    }

    public async create(path: string, payload: any, opts?: CRUDOptions): Promise<Response<any>> {
        const url = `${this.cleanPath(path)}/create`;
        
        return this.request(url, {
            method: HttpMethods.POST,
            opts: opts ?? { contentType: ContentTypes.JSON },
            body: JSON.stringify(payload),
        });
    }

    public async update(path: string, payload: any, id?: number, opts?: CRUDOptions): Promise<Response<any>> {
        const url = id 
            ? `${this.cleanPath(path)}/update/${id}`
            : `${this.cleanPath(path)}/update`;
        
        return this.request(url, {
            method: HttpMethods.PUT,
            opts: opts ?? { contentType: ContentTypes.JSON },
            body: JSON.stringify(payload),
        });
    }

    public async delete(path: string, id?: number): Promise<Response<any>> {
        const url = id ? `${this.cleanPath(path)}/${id}` : this.cleanPath(path);
        
        return this.request(url, {
            method: HttpMethods.DELETE,
            opts: { contentType: ContentTypes.JSON },
        });
    }

    public async getRaw(path: string, id?: number): Promise<Response<any>> {
        const cleanPath = this.cleanPath(path);
        const baseUrl = !this.isCompletePath(cleanPath) ? '' : cleanPath;
        const url = id
            ? `${baseUrl}${this.cleanPath(path)}/${id}`
            : `${baseUrl}${this.cleanPath(path)}`;
        
        return this.request(url, {
            method: HttpMethods.GET,
            opts: { contentType: ContentTypes.JSON },
        });
    }

    public async upload(path: string, data: any, id?: number): Promise<Response<any>> {
        const url = id ? `${this.cleanPath(path)}/${id}` : this.cleanPath(path);
        
        const formData = Object.keys(data).reduce((fd, field) => {
            fd.append(field, data[field]);
            return fd;
        }, new FormData());
        
        return this.request(url, {
            method: HttpMethods.PUT,
            opts: {},
            body: formData,
        });
    }

    public async uploadFile(path: string, data: any): Promise<Response<any>> {
        const url = this.cleanPath(path);
        
        const formData = new FormData();
        formData.append("upload", data.file);
        formData.append("data", JSON.stringify(data.script));
        
        return this.request(url, {
            method: HttpMethods.PATCH,
            opts: {},
            body: formData,
        });
    }

    private getApiUrl(): string {
        if (!this.apiUrl) throw new Error("Api URL is not configured.");

        return this.apiUrl;
    }

    private async request(
        path: string,
        config: {
            method: HttpMethods;
            opts: CRUDOptions;
            body?: any;
            isBinary?: boolean;
        }
    ): Promise<Response<any>> {
        const url = `${this.getApiUrl()}${path}`;

        const options: RequestInit = {
            method: config.method,
            headers: this.getHeadersNew(config.opts),
            credentials: 'include',
        };

        if (config.body) {
            options.body = config.body;
        }

        const fetchedResponse = await fetch(url, options);
        return this.handleResponse(fetchedResponse, config.isBinary);
    }

    private getHeadersNew(opts: CRUDOptions): Headers {
        const headers = {... this.headers};

        if (opts.contentType) {
            headers["Content-Type"] = opts.contentType;
            headers.Accept = ContentTypes.JSON;
        }
        
        return new Headers(headers);
    }

    private getHeaders(ignoreContentType?: boolean): Headers {
        const headers = this.headers;

        if (!ignoreContentType) {
            headers["Content-Type"] = ContentTypes.JSON;
            headers.Accept = ContentTypes.JSON;
        }

        return new Headers(headers);
    }

    private isCompletePath(url: string): boolean {
        return url.includes("http") || url.includes("https");
    }

    private cleanPath(path: string): string {
        path = path.startsWith("/") ? path.slice(1) : path;
        path = path.endsWith("/") ? path.slice(0, -1) : path;
        return path;
    }

    private async handleResponse(response: globalThis.Response, isBinary: boolean = false): Promise<Response<any>> {
        const fullResponse = { 
            status: response.status,
            data: null
        };

        if (!response.ok) return fullResponse;

        const data = isBinary ? await response.arrayBuffer() : await response.json();
        fullResponse.data = data;

        return fullResponse;
    }
}
