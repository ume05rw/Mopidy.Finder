import XhrQueryableBase from './XhrQueryableBase';
import { AxiosResponse } from 'axios';

interface IJsonRpcParamsBase {
    jsonrpc: string;
}

interface IJsonRpcQueryParams extends IJsonRpcParamsBase {
    method: string;
    params?: { [name: string]: any };
    id?: number;
}

interface IJsonRpcResultParams extends IJsonRpcParamsBase {
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
                .catch((e): AxiosResponse => {
                    const resultData: IJsonRpcResultParams = {
                        jsonrpc: '2.0',
                        error: e
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
            console.error(`JsonRpcError: method=${params.method}`); // eslint-disable-line
            console.error('returns null'); // eslint-disable-line
        }

        if (result && result.error) {
            // 応答にerrorが含まれるとき
            console.error(`JsonRpcError: method=${params.method}`); // eslint-disable-line
            console.error(result); // eslint-disable-line
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

        const result = await this.QueryJsonRpc(query);

        return result;
    }

    protected async JsonRpcNotice(method: string, params: any = null): Promise<boolean> {
        const query: IJsonRpcQueryParams = {
            jsonrpc: '2.0',
            method: method
        };

        if (params)
            query.params = params;

        const result = await this.QueryJsonRpc(query);

        return (!result || (result && !result.error));
    }
}
