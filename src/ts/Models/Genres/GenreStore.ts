import { IEnumerable } from 'linq';
import StoreBase from '../Bases/StoreBase';
import { default as Genre, IGenre } from './Genre';

export default class GenreStore extends StoreBase<Genre> {

    public async GetList(): Promise<IEnumerable<Genre>> {
        const result = await this.QueryGet('Genre/GetList');
        const entities = (result.Succeeded)
            ? Genre.CreateArray(result.Result as IGenre[])
            : [];

        return this.Enumerable.from(entities);
    }
}
