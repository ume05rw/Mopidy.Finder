import { default as StoreBase, PagenatedResult } from '../Bases/StoreBase';
import { default as AlbumTracks, IAlbumTracks } from './AlbumTracks';
import Track from '../Tracks/Track';

export default class AlbumTracksStore extends StoreBase<AlbumTracks> {

    public async GetList(
        genreIds: number[],
        artistIds: number[],
        page: number
    ): Promise<PagenatedResult<AlbumTracks>> {
        const response = await this.QueryGet('AlbumTracks/GetPagenatedList', {
            GenreIds: genreIds,
            ArtistIds: artistIds,
            Page: page
        });

        if (!response.Succeeded) {
            console.error(response.Errors);
            throw new Error('Unexpected Error on ApiQuery');
        }
        var result = response.Result as PagenatedResult<AlbumTracks>;
        result.ResultList = AlbumTracks.CreateArray(result.ResultList);

        return result;
    }

    public async PlayAlbumByTlId(tlId: number): Promise<boolean> {
        const response = await this.QueryPost('AlbumTracks/PlayAlbumByTlId', tlId);

        if (!response.Succeeded) {
            console.error(response.Errors);
            throw new Error('Unexpected Error on ApiQuery');
        }
        
        return response.Result as boolean;
    }

    public async PlayAlbumByTrack(track: Track): Promise<AlbumTracks> {
        const response = await this.QueryPost('AlbumTracks/PlayAlbumByTrack', track);

        if (!response.Succeeded) {
            console.error(response.Errors);
            throw new Error('Unexpected Error on ApiQuery');
        }
        var result = AlbumTracks.Create(response.Result as IAlbumTracks);

        return result;
    }
}
