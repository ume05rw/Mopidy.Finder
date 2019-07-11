import Libraries from '../../Libraries';
import * as Enumerable from 'linq';
import XhrQueryableBase from './XhrQueryableBase';

export interface IPagenatedResult<T> {
    TotalLength: number;
    ResultPage?: number;
    ResultLength: number;
    ResultList: T[]
}

export default abstract class StoreBase<T> extends XhrQueryableBase {
    protected Enumerable: typeof Enumerable = Libraries.Enumerable;
}
