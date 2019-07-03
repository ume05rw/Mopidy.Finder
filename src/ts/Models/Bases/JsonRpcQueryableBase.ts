import XhrQueryableBase from './XhrQueryableBase';

interface JsonRpcParamsBase {
    jsonrpc: string;
}

interface JsonRpcQueryParams extends JsonRpcParamsBase {
    method: string;
    params?: { [name: string]: any };
    id?: number;
}

interface JsonRpcResultParams extends JsonRpcParamsBase {
    result?: any;
    error?: any;
    id: number;
}

export default abstract class JsonRpcQueryableBase extends XhrQueryableBase {
    private static readonly Url: string = 'JsonRpc';
    private static IdCounter: number = 1;

    private async QueryJsonRpc(params: JsonRpcQueryParams): Promise<JsonRpcResultParams> {
        params.jsonrpc = '2.0';

        try {
            const response = await XhrQueryableBase.XhrInstance.post(JsonRpcQueryableBase.Url, params);
            const result = response.data as JsonRpcResultParams;

            if (result.error) {
                console.error(`JsonRpcError: method=${params.method}`);
                console.error(result);
            }

            return result;

        } catch (ex) {
            const error = {
                error: `Network Error: ${ex}`
            } as JsonRpcResultParams;

            if (params.id)
                error.id = params.id;

            console.error(`JsonRpcError: method=${params.method}`);
            console.error(error);

            return error;
        }
    };

    protected async JsonRpcRequest(method: string, params: any = null): Promise<JsonRpcResultParams> {
        const query = {
            method: method,
            id: JsonRpcQueryableBase.IdCounter
        } as JsonRpcQueryParams;

        if (params)
            query.params = params;

        JsonRpcQueryableBase.IdCounter++;

        const result = await this.QueryJsonRpc(query);

        return result;
    }

    protected async JsonRpcNotice(method: string, params: any = null): Promise<boolean> {
        const query = {
            method: method
        } as JsonRpcQueryParams;

        if (params)
            query.params = params;

        const result = await this.QueryJsonRpc(query);

        return !(result.error);
    }
}
