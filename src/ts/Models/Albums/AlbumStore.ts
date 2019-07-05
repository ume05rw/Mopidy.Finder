import { default as StoreBase, PagenatedResult } from '../Bases/StoreBase';
import Album from './Album';

export default class AlbumStore extends StoreBase<Album> {

    public async GetList(genreIds: number[], artistIds: number[], page: number): Promise<PagenatedResult<Album>> {
        const result = await this.QueryGet('Album/GetPagenatedList', {
            genreIds: genreIds,
            artistIds: artistIds,
            page: page
        });

        if (!result.Succeeded) {
            console.error(result.Errors);
            throw new Error('Unexpected Error on ApiQuery');
        }

        return result.Result as PagenatedResult<Album>;
    }
}
