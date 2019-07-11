import { default as StoreBase, IPagenatedResult } from '../Bases/StoreBase';
import Artist from './Artist';

export default class ArtistStore extends StoreBase<Artist> {

    public async GetList(genreIds: number[], page: number): Promise<IPagenatedResult<Artist>> {
        const response = await this.QueryGet('Artist/GetPagenatedList', {
            GenreIds: genreIds,
            Page: page
        });

        if (!response.Succeeded) {
            console.error(response.Errors);
            throw new Error('Unexpected Error on ApiQuery');
        }

        var result = response.Result as IPagenatedResult<Artist>;
        result.ResultList = Artist.CreateArray(result.ResultList);

        return result;
    }
}
