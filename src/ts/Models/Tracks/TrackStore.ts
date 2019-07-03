import { IEnumerable } from 'linq';
import StoreBase from '../Bases/StoreBase';
import Track from './Track';
import Album from '../Albums/Album';

export default class TrackStore extends StoreBase<Track> {

    public async GetListByAlbum(album: Album): Promise<IEnumerable<Track>> {
        const result = await this.QueryGet('Track/GetTracksByAlbumId', {
            albumId: album.Id
        });
        const entities = (result.Succeeded)
            ? result.Result as Track[]
            : [];

        return this.Enumerable.from(entities);
    }
}
