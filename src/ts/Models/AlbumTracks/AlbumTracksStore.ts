import StoreBase from '../Bases/StoreBase';
import AlbumTracks from './AlbumTracks';

export default class AlbumTracksStore extends StoreBase<AlbumTracks> {

    public async GetList(albumIds: number[]): Promise<AlbumTracks[]> {
        const result = await this.QueryGet('AlbumTracks/GetList', {
            albumIds: albumIds
        });

        if (!result.Succeeded) {
            console.error(result.Errors);
            throw new Error('Unexpected Error on ApiQuery');
        }

        return result.Result as AlbumTracks[];
    }
}
