import { IEnumerable } from 'linq';
import Artist from '../Artists/Artist';
import StoreBase from '../Bases/StoreBase';
import Album from './Album';
import Genre from '../Genres/Genre';

export default class AlbumStore extends StoreBase<Album> {

    public async GetList(): Promise<IEnumerable<Album>> {
        const result = await this.QueryGet('Album/GetList');
        const entities = (result.Succeeded)
            ? result.Result as Album[]
            : [];

        return this.Enumerable.from(entities);
    }

    public async GetListByArtist(artist: Artist): Promise<IEnumerable<Album>> {
        const result = await this.QueryGet('Album/GetListByArtistId', {
            artistId: artist.Id
        });
        const entities = (result.Succeeded)
            ? result.Result as Album[]
            : [];

        return this.Enumerable.from(entities);
    }

    public async GetListByGenre(genre: Genre): Promise<IEnumerable<Album>> {
        const result = await this.QueryGet('Album/GetListByGenreId', {
            genreId: genre.Id
        });
        const entities = (result.Succeeded)
            ? result.Result as Album[]
            : [];

        return this.Enumerable.from(entities);
    }
}
