import { default as StoreBase, PagenatedResult } from '../Bases/StoreBase';
import Artist from './Artist';

export default class ArtistStore extends StoreBase<Artist> {

    public async GetList(genreIds: number[], page: number): Promise<PagenatedResult<Artist>> {
        const result = await this.QueryGet('Artist/GetPagenatedList', {
            genreIds: genreIds,
            page: page
        });

        if (!result.Succeeded) {
            console.error(result.Errors);
            throw new Error('Unexpected Error on ApiQuery');
        }

        return result.Result as PagenatedResult<Artist>;
    }
}
