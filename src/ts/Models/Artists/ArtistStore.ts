import { default as StoreBase, PagenatedResult } from '../Bases/StoreBase';
import Artist from './Artist';

export default class ArtistStore extends StoreBase<Artist> {

    public async GetList(genreIds: number[], page: number): Promise<PagenatedResult<Artist>> {
        const response = await this.QueryGet('Artist/GetPagenatedList', {
            genreIds: genreIds,
            page: page
        });

        if (!response.Succeeded) {
            console.error(response.Errors);
            throw new Error('Unexpected Error on ApiQuery');
        }

        var result = response.Result as PagenatedResult<Artist>;
        result.ResultList = Artist.CreateArray(result.ResultList);

        return result;
    }
}
