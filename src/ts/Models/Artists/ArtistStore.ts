import Libraries from '../../Libraries';
import StoreBase from '../Bases/StoreBase';
import Artist from './Artist';

export default class ArtistStore extends StoreBase<Artist> {

    public async Init(): Promise<boolean> {
        const entities: Artist[] = await this.ApiGet('Artist/FindAll');
        this.Entities = Libraries.Enumerable.from(entities);

        return true;
    }
}
