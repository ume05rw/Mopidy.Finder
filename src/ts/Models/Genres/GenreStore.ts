import { default as StoreBase, IPagenatedResult } from '../Bases/StoreBase';
import Genre from './Genre';
import Exception from '../../Utils/Exception';

export interface IPagenateQueryArgs {
    FilterText: string;
    Page: number;
}

export default class GenreStore extends StoreBase<Genre> {

    public async Exists(): Promise<boolean> {
        const response = await this.QueryGet('Genre/Exists');

        if (!response.Succeeded)
            Exception.Throw('Unexpected Error on ApiQuery', response.Errors);

        return response.Result as boolean;
    }

    public async GetList(args: IPagenateQueryArgs): Promise<IPagenatedResult<Genre>> {
        const response = await this.QueryGet('Genre/GetPagenatedList', args);

        if (!response.Succeeded)
            Exception.Throw('Unexpected Error on ApiQuery', response.Errors);

        const result = response.Result as IPagenatedResult<Genre>;
        result.ResultList = Genre.CreateArray(result.ResultList);

        return result;
    }
}
