import XhrQueryableBase from './XhrQueryableBase';
import { AxiosResponse } from 'axios';
import Dump from '../../Utils/Dump'

interface IJsonRpcParamsBase {
    jsonrpc: string;
}

interface IJsonRpcQueryParams extends IJsonRpcParamsBase {
    method: string;
    params?: { [name: string]: any };
    id?: number;
}

export interface IJsonRpcResultParams extends IJsonRpcParamsBase {
    result?: any;
    error?: any;
    id?: number;
}

export default abstract class JsonRpcQueryableBase extends XhrQueryableBase {
    private static readonly Url: string = 'JsonRpc';
    private static IdCounter: number = 1;

    private async QueryJsonRpc(params: IJsonRpcQueryParams): Promise<IJsonRpcResultParams> {
        params.jsonrpc = '2.0';

        const response
            = await XhrQueryableBase.XhrInstance.post(JsonRpcQueryableBase.Url, params)
                .catch((ex): AxiosResponse => {
                    Dump.Error('JsonRpcQueryableBase.QueryJsonRpc: Unexpected Xhr Error.', ex);

                    const resultData: IJsonRpcResultParams = {
                        jsonrpc: '2.0',
                        error: ex
                    };
                    if (params.id)
                        resultData.id = params.id;

                    const result: AxiosResponse = {
                        status: 406,
                        statusText: 'Network Error',
                        config: null,
                        headers: null,
                        data: resultData
                    };

                    return result
                });

        const result = response.data as IJsonRpcResultParams;

        if (params.id && !result) {
            // id付きにも拘らず、応答が無いとき
            Dump.Error('JsonRpcQueryableBase.QueryJsonRpc: Query with id, but No-Response.', {
                queryParams: params
            });
        }

        if (result && result.error) {
            // 応答にerrorが含まれるとき
            Dump.Error('JsonRpcQueryableBase.QueryJsonRpc: Error Result.', {
                queryParams: params,
                response: result
            });
        }

        return result;
    }

    protected async JsonRpcRequest(method: string, params: any = null): Promise<IJsonRpcResultParams> {
        const query: IJsonRpcQueryParams = {
            jsonrpc: '2.0',
            method: method,
            id: JsonRpcQueryableBase.IdCounter
        };

        if (params)
            query.params = params;

        JsonRpcQueryableBase.IdCounter++;

        return await this.QueryJsonRpc(query);
    }

    protected async JsonRpcNotice(method: string, params: any = null): Promise<true | IJsonRpcResultParams> {
        const query: IJsonRpcQueryParams = {
            jsonrpc: '2.0',
            method: method
        };

        if (params)
            query.params = params;

        const result = await this.QueryJsonRpc(query);

        return (result && result.error)
            ? result
            : true;
    }

    protected CreateResponse(): IJsonRpcResultParams {
        const result: IJsonRpcResultParams = {
            jsonrpc: '2.0'
        };

        return result;
    }
}
