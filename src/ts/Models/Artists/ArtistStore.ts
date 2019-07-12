import { default as StoreBase, IPagenatedResult } from '../Bases/StoreBase';
import Artist from './Artist';

export interface IPagenateQueryArgs {
    GenreIds: number[];
    FilterText: string;
    Page: number;
}

export default class ArtistStore extends StoreBase<Artist> {

    public async GetList(args: IPagenateQueryArgs): Promise<IPagenatedResult<Artist>> {
        const response = await this.QueryGet('Artist/GetPagenatedList', args);

        if (!response.Succeeded)
            throw new Error('Unexpected Error on ApiQuery');

        const result = response.Result as IPagenatedResult<Artist>;
        result.ResultList = Artist.CreateArray(result.ResultList);

        return result;
    }
}
