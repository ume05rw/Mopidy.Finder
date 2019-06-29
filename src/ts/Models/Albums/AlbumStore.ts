import Libraries from '../../Libraries';
import StoreBase from '../Bases/StoreBase';
import Album from './Album';

export default class AlbumStore extends StoreBase<Album> {

    public async Init(): Promise<boolean> {
        const entities: Album[] = await this.ApiGet('Album/FindAll');
        this.Entities = Libraries.Enumerable.from(entities);

        return true;
    }
}
