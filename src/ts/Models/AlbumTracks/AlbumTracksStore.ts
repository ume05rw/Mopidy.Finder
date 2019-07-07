import { default as StoreBase, PagenatedResult } from '../Bases/StoreBase';
import { default as AlbumTracks, IAlbumTracks } from './AlbumTracks';

export default class AlbumTracksStore extends StoreBase<AlbumTracks> {

    public async GetList(
        genreIds: number[],
        artistIds: number[],
        page: number
    ): Promise<PagenatedResult<AlbumTracks>> {
        const response = await this.QueryGet('AlbumTracks/GetPagenatedList', {
            genreIds: genreIds,
            artistIds: artistIds,
            page: page
        });

        if (!response.Succeeded) {
            console.error(response.Errors);
            throw new Error('Unexpected Error on ApiQuery');
        }
        var result = response.Result as PagenatedResult<AlbumTracks>;
        result.ResultList = AlbumTracks.CreateArray(result.ResultList);

        return result;
    }
}
