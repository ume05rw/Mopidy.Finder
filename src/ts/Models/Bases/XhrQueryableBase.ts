import Axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import * as qs from 'qs';
import EventableBase from '../../EventableBase';
import Dump from '../../Utils/Dump';

export interface IXhrError {
    Message: string;
    Code?: number;
    FieldName?: string;
}

export interface IXhrResult {
    Succeeded: boolean;
    Result?: any;
    Errors?: IXhrError[];
}

export default abstract class XhrQueryableBase extends EventableBase {

    // Axios+qsによるURIパラメータ生成
    // https://blog.ryou103.com/post/axios-send-object-query/
    protected static ParamsSerializer(params: any): string {
        return qs.stringify(params);
    }

    private static get Protocol(): string {
        return (location)
            ? location.protocol
            : 'http:';
    }

    private static get HostName(): string {
        return (location)
            ? location.hostname
            : 'localhost';
    }

    private static get Port(): string {
        return (location)
            ? location.port
            : '6690';
    }

    protected static XhrInstance: AxiosInstance = Axios.create({
        //// APIの基底URLが存在するとき
        baseURL: `${XhrQueryableBase.Protocol}//${XhrQueryableBase.HostName}:${XhrQueryableBase.Port}/`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        responseType: 'json'
    });

    private ParseResponse(data: any): IXhrResult {
        if (!data) {
            const error: IXhrError = {
                Message: 'Unexpected Error'
            };
            const result: IXhrResult = {
                Succeeded: false,
                Errors: [error]
            };

            return result;
        }

        if ((typeof data == 'object') && data.hasOwnProperty('Succeeded')) {
            // dataが定型応答のとき
            const result = data as IXhrResult;
            if (!result.Succeeded) {
                console.error('Network Error:'); // eslint-disable-line
                console.error(result.Errors); // eslint-disable-line
            }

            return data as IXhrResult
        } else {
            // dataが定型応答のとき
            const result: IXhrResult = {
                Succeeded: true,
                Result: data
            };

            return result;
        }
    }

    private CreateErrorResponse(error: any): AxiosResponse {
        const formattedError: IXhrResult = {
            Succeeded: false,
            Errors: error,
        };
        const result: AxiosResponse = {
            status: 406,
            statusText: 'Network Error',
            config: null,
            headers: null,
            data: formattedError
        };

        return result;
    }

    protected async QueryGet(url: string, params: any = null): Promise<IXhrResult> {
        const config: AxiosRequestConfig = {
            params: params,
            paramsSerializer: XhrQueryableBase.ParamsSerializer            
        };
        const response = await XhrQueryableBase.XhrInstance.get(url, config)
            .catch((ex): AxiosResponse => {
                Dump.Error('XhrQueryableBase.QueryGet: Unexpexted Xhr Error.', ex);

                return this.CreateErrorResponse(ex);
            });

        return this.ParseResponse(response.data);
    }

    protected async QueryPost(url: string, params: any = null): Promise<IXhrResult> {
        const response = await XhrQueryableBase.XhrInstance.post(url, params)
            .catch((ex): AxiosResponse => {
                Dump.Error('XhrQueryableBase.QueryPost: Unexpexted Xhr Error.', ex);

                return this.CreateErrorResponse(ex);
            });

        return this.ParseResponse(response.data);

    }

    protected async QueryPut(url: string, params: any = null): Promise<IXhrResult> {
        const response = await XhrQueryableBase.XhrInstance.put(url, params)
            .catch((ex): AxiosResponse => {
                Dump.Error('XhrQueryableBase.QueryPut: Unexpexted Xhr Error.', ex);

                return this.CreateErrorResponse(ex);
            });

        return this.ParseResponse(response.data);
    }

    protected async QueryDelete(url: string, params: any = null): Promise<IXhrResult> {
        const response = await XhrQueryableBase.XhrInstance.delete(url, params)
            .catch((ex): AxiosResponse => {
                Dump.Error('XhrQueryableBase.QueryDelete: Unexpexted Xhr Error.', ex);

                return this.CreateErrorResponse(ex);
            });

        return this.ParseResponse(response.data);
    }
}
