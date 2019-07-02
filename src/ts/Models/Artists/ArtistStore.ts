import { IEnumerable } from 'linq';
import StoreBase from '../Bases/StoreBase';
import Genre from '../Genres/Genre';
import Artist from './Artist';

export default class ArtistStore extends StoreBase<Artist> {

    public async GetList(genre: Genre = null): Promise<IEnumerable<Artist>> {
        const result = (!genre)
            ? await this.QueryGet('Artist/GetList')
            : await this.QueryGet('Artist/GetListByGenreId', {
                genreId: genre.Id
            });
        const entities = (result.Succeeded)
            ? result.Result as Artist[]
            : [];

        return this.Enumerable.from(entities);
    }
}
