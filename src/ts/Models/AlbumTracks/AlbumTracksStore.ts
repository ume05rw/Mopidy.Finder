import StoreBase from '../Bases/StoreBase';
import { default as AlbumTracks, IAlbumTracks } from './AlbumTracks';

export default class AlbumTracksStore extends StoreBase<AlbumTracks> {

    public async GetList(albumIds: number[]): Promise<AlbumTracks[]> {
        const response = await this.QueryGet('AlbumTracks/GetList', {
            albumIds: albumIds
        });

        if (!response.Succeeded) {
            console.error(response.Errors);
            throw new Error('Unexpected Error on ApiQuery');
        }

        var result = AlbumTracks.CreateArray(response.Result as IAlbumTracks[]);

        return result;
    }
}
