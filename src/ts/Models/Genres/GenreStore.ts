import { default as StoreBase, IPagenatedResult } from '../Bases/StoreBase';
import Genre from './Genre';

export interface IPagenateQueryArgs {
    FilterText: string;
    Page: number;
}

export default class GenreStore extends StoreBase<Genre> {

    public async GetList(args: IPagenateQueryArgs): Promise<IPagenatedResult<Genre>> {
        const response = await this.QueryGet('Genre/GetPagenatedList', args);

        if (!response.Succeeded)
            throw new Error('Unexpected Error on ApiQuery');

        const result = response.Result as IPagenatedResult<Genre>;
        result.ResultList = Genre.CreateArray(result.ResultList);

        return result;
    }
}
