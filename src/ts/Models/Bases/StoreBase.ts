import Axios, { AxiosInstance } from 'axios';
import * as qs from 'qs';
import Libraries from '../../Libraries';
import * as Enumerable from 'linq';

export interface XhrError {
    Message: string;
    Code?: number;
    FieldName?: string;
}

export interface XhrResult {
    Succeeded: boolean;
    Result?: any;
    Errors?: XhrError[]
}

export default abstract class StoreBase<T> {

    // Axios+qsによるURIパラメータ生成
    // https://blog.ryou103.com/post/axios-send-object-query/
    protected static ParamsSerializer(params: any): string {
        return qs.stringify(params);
    }

    protected Enumerable: typeof Enumerable = Libraries.Enumerable;

    protected static XhrInstance: AxiosInstance = Axios.create({
        //// APIの基底URLが存在するとき
        baseURL: 'http://localhost:8080/', 
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        responseType: 'json' 
    });

    private ParseResponse(data: any): XhrResult {
        if (!data)
            return {
                Succeeded: false,
                Errors: [{
                    Message: 'Unexpected Error'
                }]
            } as XhrResult;

        return ((typeof data == 'object') && data.hasOwnProperty('Succeeded'))
            // dataが定型応答のとき
            ? data as XhrResult
            // dataが定型応答のとき
            : {
                Succeeded: true,
                Result: data
            } as XhrResult;
    }

    protected async QueryGet(url: string, params: any = null): Promise<XhrResult> {
        try {
            const response = await StoreBase.XhrInstance.get(url, {
                params: params,
                paramsSerializer: StoreBase.ParamsSerializer
            });

            return this.ParseResponse(response.data);
        } catch (ex) {
            console.error(`QueryGet.Error: url=${url}`);
            if (params) {
                console.error('params:')
                console.error(params);
            }
            console.error(ex);
        }
    }

    protected async QueryPost(url: string, params: any = null): Promise<XhrResult> {
        try {
            const response = await StoreBase.XhrInstance.post(url, params);

            return this.ParseResponse(response.data);
        } catch (ex) {
            console.error(`QueryPost.Error: url=${url}`);
            if (params) {
                console.error('params:')
                console.error(params);
            }
            console.error(ex);

            return this.ParseResponse(null);
        }
    }

    protected async RawQueryPut(url: string, params: any = null): Promise<XhrResult> {
        try {
            const response = await StoreBase.XhrInstance.put(url, params);

            return this.ParseResponse(response.data);
        } catch (ex) {
            console.error(`QueryPut.Error: url=${url}`);
            if (params) {
                console.error('params:')
                console.error(params);
            }
            console.error(ex);

            return this.ParseResponse(null);
        }
    }

    protected async QueryDelete(url: string, params: any = null): Promise<XhrResult> {
        try {
            const response = await StoreBase.XhrInstance.delete(url, params);

            return this.ParseResponse(response.data);
        } catch (ex) {
            console.error(`QueryDelete.Error: url=${url}`);
            if (params) {
                console.error('params:')
                console.error(params);
            }
            console.error(ex);

            return this.ParseResponse(null);
        }
    }
}
