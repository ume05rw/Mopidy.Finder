import Axios, { AxiosInstance } from 'axios';
import * as qs from 'qs';
import Libraries from '../../Libraries';
import { IEnumerable } from 'linq';

interface JsonRpcFrame {
    jsonrpc: string;
}

interface JsonRpcRequest extends JsonRpcFrame {
    method: string;
    params?: { [name: string]: any };
    id?: number;
}

interface JsonRpcResult extends JsonRpcFrame {
    result?: any;
    error?: any;
    id: number;
}

export default class StoreBase<T> {

    // Axios+qsによるURIパラメータ生成
    // https://blog.ryou103.com/post/axios-send-object-query/
    private static ParamsSerializer(params: any): string {
        return qs.stringify(params);
    }

    public Entities: IEnumerable<T>;

    public GetAll(): T[] {
        return this.Entities.toArray();
    }

    private static XhrInstance: AxiosInstance = Axios.create({
        //// APIの基底URLが存在するとき
        baseURL: 'http://localhost:8080/', 
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        responseType: 'json' 
    });

    private static IdCounter: number = 1;


    public async ApiGet(url: string, params: any = null): Promise<any> {
        try {
            const result = await StoreBase.XhrInstance.get(url, {
                params: params,
                paramsSerializer: StoreBase.ParamsSerializer
            });

            return result.data;
        } catch (e) {

        }
    }


    private JsonRpcCall(request: JsonRpcRequest): Promise<JsonRpcResult> {
        return new Promise<JsonRpcResult>(async (resolve: (value: JsonRpcResult) => void) => {
            request.jsonrpc = '2.0';

            try {
                const result = await StoreBase.XhrInstance.post('JsonRpc', request);

                resolve(result.data as JsonRpcResult);
            } catch (ex) {
                const error = {
                    id: request.id,
                    error: `Network Error: ${ex}`
                } as JsonRpcResult;

                resolve(error);
            }
        });
    };

    private GetRequest(method: string, params: any = null): JsonRpcRequest {
        const request = {
            method: method
        } as JsonRpcRequest;

        if (params)
            request.params = params;

        return request;
    }

    protected JsonRpcQuery(method: string, params: any = null): Promise<JsonRpcResult> {
        const request = this.GetRequest(method, params);

        request.id = StoreBase.IdCounter;
        StoreBase.IdCounter++;

        return this.JsonRpcCall(request);
    }

    protected JsonRpcNotice(method: string, params: any = null): void {
        const request = this.GetRequest(method, params);
        this.JsonRpcCall(request);
    }
}
