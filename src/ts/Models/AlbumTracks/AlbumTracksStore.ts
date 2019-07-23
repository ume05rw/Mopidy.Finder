import { default as StoreBase, IPagenatedResult } from '../Bases/StoreBase';
import { default as AlbumTracks, IAlbumTracks } from './AlbumTracks';
import Track from '../Tracks/Track';
import Exception from '../../Utils/Exception';

export interface IPagenateQueryArgs {
    GenreIds: number[];
    ArtistIds: number[];
    FilterText: string;
    Page: number;
}

export default class AlbumTracksStore extends StoreBase<AlbumTracks> {

    public async GetList(args: IPagenateQueryArgs): Promise<IPagenatedResult<AlbumTracks>> {
        const response = await this.QueryGet('AlbumTracks/GetPagenatedList', args);

        if (!response.Succeeded)
            Exception.Throw('Unexpected Error on ApiQuery', response.Errors);
        
        const result = response.Result as IPagenatedResult<AlbumTracks>;
        result.ResultList = AlbumTracks.CreateArray(result.ResultList);

        return result;
    }

    public async PlayAlbumByTrack(track: Track): Promise<AlbumTracks> {
        const response = await this.QueryPost('Player/PlayAlbumByTrackId', track.Id);

        if (!response.Succeeded)
            Exception.Throw('Unexpected Error on ApiQuery', response.Errors);

        const result = AlbumTracks.Create(response.Result as IAlbumTracks);

        return result;
    }

    public async PlayAlbumByTlId(tlId: number): Promise<boolean> {
        const response = await this.QueryPost('Player/PlayAlbumByTlId', tlId);

        if (!response.Succeeded)
            Exception.Throw('Unexpected Error on ApiQuery', response.Errors);

        return response.Result as boolean;
    }

    public async ClearList(): Promise<boolean> {
        const response = await this.QueryPost('Player/ClearList');

        if (!response.Succeeded)
            Exception.Throw('Unexpected Error on ApiQuery', response.Errors);

        return response.Result as boolean;
    }
}
