import Axios, { AxiosInstance } from 'axios';
import Libraries from '../../Libraries';

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

    private static XhrInstance: AxiosInstance = Axios.create({
        //// APIの基底URLが存在するとき
        baseURL: 'http://localhost:8080/JsonRpc/', 
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        responseType: 'json' 
    });

    private static IdCounter: number = 1;

    private Call(request: JsonRpcRequest): Promise<JsonRpcResult> {
        return new Promise<JsonRpcResult>(async (resolve: (value: JsonRpcResult) => void) => {
            request.jsonrpc = '2.0';

            try {
                const result = await StoreBase.XhrInstance.post(null, request);

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

    protected Query(method: string, params: any = null): Promise<JsonRpcResult> {
        const request = this.GetRequest(method, params);

        request.id = StoreBase.IdCounter;
        StoreBase.IdCounter++;

        return this.Call(request);
    }

    protected Notice(method: string, params: any = null): void {
        const request = this.GetRequest(method, params);
        this.Call(request);
    }
}
