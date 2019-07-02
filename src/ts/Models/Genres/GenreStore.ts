import { IEnumerable } from 'linq';
import StoreBase from '../Bases/StoreBase';
import Genre from './Genre';

export default class GenreStore extends StoreBase<Genre> {

    public async GetList(): Promise<IEnumerable<Genre>> {
        const result = await this.QueryGet('Genre/GetList');
        const entities = (result.Succeeded)
            ? result.Result as Genre[]
            : [];

        return this.Enumerable.from(entities);
    }
}
