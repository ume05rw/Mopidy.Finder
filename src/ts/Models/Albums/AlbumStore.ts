import { default as StoreBase, PagenatedResult } from '../Bases/StoreBase';
import Album from './Album';

export default class AlbumStore extends StoreBase<Album> {

    public async GetList(genreIds: number[], artistIds: number[], page: number): Promise<PagenatedResult<Album>> {
        const response = await this.QueryGet('Album/GetPagenatedList', {
            genreIds: genreIds,
            artistIds: artistIds,
            page: page
        });

        if (!response.Succeeded) {
            console.error(response.Errors);
            throw new Error('Unexpected Error on ApiQuery');
        }

        var result = response.Result as PagenatedResult<Album>;
        result.ResultList = Album.CreateArray(result.ResultList);

        return result;
    }
}
