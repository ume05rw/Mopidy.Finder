import { default as StoreBase, IPagenatedResult } from '../Bases/StoreBase';
import { default as AlbumTracks, IAlbumTracks } from './AlbumTracks';
import Track from '../Tracks/Track';

export default class AlbumTracksStore extends StoreBase<AlbumTracks> {

    public async GetList(
        genreIds: number[],
        artistIds: number[],
        page: number
    ): Promise<IPagenatedResult<AlbumTracks>> {
        const response = await this.QueryGet('AlbumTracks/GetPagenatedList', {
            GenreIds: genreIds,
            ArtistIds: artistIds,
            Page: page
        });

        if (!response.Succeeded) {
            console.error(response.Errors);
            throw new Error('Unexpected Error on ApiQuery');
        }
        var result = response.Result as IPagenatedResult<AlbumTracks>;
        result.ResultList = AlbumTracks.CreateArray(result.ResultList);

        return result;
    }

    public async PlayAlbumByTrack(track: Track): Promise<AlbumTracks> {
        const response = await this.QueryPost('Player/PlayAlbumByTrack', track);

        if (!response.Succeeded) {
            console.error(response.Errors);
            throw new Error('Unexpected Error on ApiQuery');
        }
        var result = AlbumTracks.Create(response.Result as IAlbumTracks);

        return result;
    }

    public async PlayAlbumByTlId(tlId: number): Promise<boolean> {
        const response = await this.QueryPost('Player/PlayAlbumByTlId', tlId);

        if (!response.Succeeded) {
            console.error(response.Errors);
            throw new Error('Unexpected Error on ApiQuery');
        }

        return response.Result as boolean;
    }

    public async ClearList(): Promise<boolean> {
        const response = await this.QueryPost('Player/ClearList');

        if (!response.Succeeded) {
            console.error(response.Errors);
            throw new Error('Unexpected Error on ApiQuery');
        }

        return response.Result as boolean;
    }
}
