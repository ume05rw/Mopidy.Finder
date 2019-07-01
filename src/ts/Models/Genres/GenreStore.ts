import Libraries from '../../Libraries';
import StoreBase from '../Bases/StoreBase';
import Genre from './Genre';

export default class GenreStore extends StoreBase<Genre> {

    public async Init(): Promise<boolean> {
        const entities: Genre[] = await this.ApiGet('Genre/GetList');
        this.Entities = Libraries.Enumerable.from(entities);

        return true;
    }
}
