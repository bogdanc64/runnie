import { IDataService, CRUDOptions, HttpStatusCodes, HttpMethods, ContentTypes } from "../models/data";

export interface IResponse {
    meta: any;
    data: any;
    status: number;
}

export class DataService implements IDataService {
    public apiUrl: string | undefined;
    private headers: { [key: string]: string } = {};

    constructor(apiUrl?: string) {
        if (!apiUrl) return;

        this.apiUrl = apiUrl;
    }

    public async getBinary(path: string, id?: number): Promise<any> {
        const url = id
            ? `${this.getApiUrl()}${this.cleanPath(path)}/${id}`
            : `${this.getApiUrl()}${this.cleanPath(path)}`;

        try {
            const response = await fetch(url, {
                method: HttpMethods.GET,
                headers: this.getHeaders(),
                credentials: 'include',
            })

            return response.arrayBuffer();
        } catch (error) {
            throw error;
        }
    }

    public async get(path: string, id?: number): Promise<any> {

        const url = id
            ? `${this.cleanPath(path)}/${id}`
            : `${this.cleanPath(path)}`;

        const response = await this.request(url, {
            method: HttpMethods.GET,
            opts: { contentType: ContentTypes.JSON },
        });

        return response;
    }

    public async list(path: string, id?: number): Promise<any> {
        const url = id
            ? `${this.getApiUrl()}${this.cleanPath(path)}/${id}`
            : `${this.getApiUrl()}${this.cleanPath(path)}`;
        const fullResponse = { status: 0, data: null };
        
        try {
            const response = await fetch(url, {
                method: HttpMethods.GET,
                headers: this.getHeaders(),
                credentials: 'include',
            })
            fullResponse.status = response.status;
            if (fullResponse.status !== HttpStatusCodes.OK) throw fullResponse;

            const data = await response.json();
            fullResponse.data = data;

            return fullResponse;
        } catch (error) {
            throw error;
        }
    }

    public async authMethod(path: string, entity: any, opts: CRUDOptions): Promise<any> {
        const url = `${this.getApiUrl()}${this.cleanPath(path)}`;
        const fullResponse = { status: 0, data: null };
        const body = entity ? JSON.stringify(entity) : null;

        try {
            const response = await fetch(url, {
                method: opts.method,
                headers: this.getHeadersNew(opts),
                credentials: 'include',
                body,
            })
            fullResponse.status = response.status;
            if (fullResponse.status !== HttpStatusCodes.OK) throw fullResponse;

            const data = await response.json();
            fullResponse.data = data;

            return fullResponse;
        } catch (error) {
            throw error;
        }
    }

    public async create(path: string, entity: any, withFile?: boolean): Promise<any> {
        const url = `${this.getApiUrl()}${this.cleanPath(path)}`;
        const fullResponse = { status: 0, data: null };
        let formData: FormData | undefined;

        if (withFile) {
            formData = Object.keys(entity).reduce((fd, field) => {
                fd.append(field, entity[field]);
                return fd;
            }, new FormData());
        }
        try {
            const response = await fetch(url, {
                method: HttpMethods.POST,
                headers: this.getHeaders(withFile),
                body: withFile ? formData : JSON.stringify(entity),
                credentials: 'include',
            })
            fullResponse.status = response.status;
            if (fullResponse.status !== HttpStatusCodes.OK) throw fullResponse;

            const data = await response.json();
            fullResponse.data = data;

            return fullResponse;
        } catch (error) {
            throw error;
        }
    }

    public async update(path: string, entity: any, id?: number, opts?: CRUDOptions): Promise<any> {
        const url = id 
         ? `${this.getApiUrl()}${this.cleanPath(path)}/${id}`
         : `${this.getApiUrl()}${this.cleanPath(path)}`;

        const headers: Headers = this.getHeadersNew(opts ?? { contentType: ContentTypes.JSON });
        const fullResponse = { status: 0, data: null };

        try {
            const response = await fetch(url, {
                method: HttpMethods.PUT,
                headers,
                body: JSON.stringify(entity),
                credentials: 'include',
            })
            fullResponse.status = response.status;
            if (fullResponse.status !== HttpStatusCodes.OK) throw fullResponse;

            const data = await response.json();
            fullResponse.data = data;

            return fullResponse;
        } catch (error) {
            throw error;
        }
    }

    public async delete(path: string, id?: number): Promise<any> {
        const url = id
            ? `${this.getApiUrl()}${this.cleanPath(path)}/${id}`
            : `${this.getApiUrl()}${this.cleanPath(path)}`;
        const fullResponse = { status: 0, data: null };

        try {
            const response = await fetch(url, {
                method: HttpMethods.DELETE,
                headers: this.getHeaders(),
            })
            fullResponse.status = response.status;
            if (fullResponse.status !== HttpStatusCodes.OK) throw fullResponse;

            const data = await response.json();
            fullResponse.data = data;

            return fullResponse;
        } catch (error) {
            throw error;
        }
    }

    public async getRaw(path: string, id?: number): Promise<any> {
        const cleanPath = this.cleanPath(path);
        const baseUrl = !this.isCompletePath(cleanPath) 
            ? this.getApiUrl()
            : cleanPath;
        const url = id
            ? `${baseUrl}${this.cleanPath(path)}/${id}`
            : `${baseUrl}${this.cleanPath(path)}`;

        try {
            const response = await fetch(url, {
                method: HttpMethods.GET,
                headers: this.getHeaders(),
                credentials: 'include',
            });

            const contentType = response.headers.get("content-type");
            if (contentType?.includes(ContentTypes.JSON)) {
                return response.json();
            } else if (contentType?.includes(ContentTypes.Sheet)) {
                return response.arrayBuffer();
            } else {
                return response.text();
            }
        } catch (error) {
            throw error;
        }
    }

    public async upload(path: string, data: any, id?: number) {
        const url = id
            ? `${this.getApiUrl()}${this.cleanPath(path)}/${id}`
            : `${this.getApiUrl()}${this.cleanPath(path)}`;

        const formData = Object.keys(data).reduce((fd, field) => {
            fd.append(field, data[field]);
            return fd;
        }, new FormData());

        const fullResponse = { status: 0, data: null };

        try {
            const response = await fetch(url, {
                method: HttpMethods.PUT,
                headers: this.getHeaders(true),
                body: formData,
                credentials: 'include',
            })
            fullResponse.status = response.status;
            if (fullResponse.status !== HttpStatusCodes.OK) throw fullResponse;

            const data = await response.json();
            fullResponse.data = data;

            return fullResponse;
        } catch (error) {
            throw error;
        }
    }

    public async uploadFile(path: string, data: any) {
        const url = `${this.getApiUrl()}${this.cleanPath(path)}`;

        const formData = new FormData();
        formData.append("upload", data.file);
        formData.append("data", JSON.stringify(data.script));
        const fullResponse = { status: 0, data: null };

        try {
            const response = await fetch(url, {
                method: HttpMethods.PATCH,
                headers: this.getHeadersNew({}),
                body: formData,
                credentials: 'include',
            })

            fullResponse.status = response.status;
            if (fullResponse.status !== HttpStatusCodes.OK) throw fullResponse;

            const data = await response.json();
            fullResponse.data = data;

            return fullResponse;
        } catch (error) {
            throw error;
        }
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
        }
    ): Promise<any> {
        const url = `${this.getApiUrl()}${path}`;

        const options: RequestInit = {
            method: config.method,
            headers: this.getHeadersNew(config.opts),
        };

        if (config.body && (
            config.method === HttpMethods.PUT || 
            config.method === HttpMethods.PATCH || 
            config.method === HttpMethods.POST
        )) {
            options.body = config.body;
        }
        const response = { status: 0, message: null };

        try {
            const fetchedResponse = await fetch(url, options);
            const json = await fetchedResponse.json();

            response.status = fetchedResponse.status;
            response.message = json.data ?? json.message;

            if (!fetchedResponse.ok) throw response;

            return response;
        } catch (error) {
            throw error;
        }
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
}
