import { default as StoreBase, IPagenatedResult } from '../Bases/StoreBase';
import Artist from './Artist';
import Exception from '../../Utils/Exception';

export interface IPagenateQueryArgs {
    GenreIds: number[];
    FilterText: string;
    Page: number;
}

export default class ArtistStore extends StoreBase<Artist> {

    public async Exists(): Promise<boolean> {
        const response = await this.QueryGet('Artist/Exists');

        if (!response.Succeeded)
            Exception.Throw('Unexpected Error on ApiQuery', response.Errors);

        return response.Result as boolean;
    }

    public async GetList(args: IPagenateQueryArgs): Promise<IPagenatedResult<Artist>> {
        const response = await this.QueryGet('Artist/GetPagenatedList', args);

        if (!response.Succeeded)
            Exception.Throw('Unexpected Error on ApiQuery', response.Errors);

        const result = response.Result as IPagenatedResult<Artist>;
        result.ResultList = Artist.CreateArray(result.ResultList);

        return result;
    }
}
