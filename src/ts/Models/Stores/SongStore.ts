import StoreBase from './StoreBase';
import Song from '../Entities/Song';
import { IEnumerable } from 'linq';
import Libraries from '../../Libraries';

export default class SongStore extends StoreBase<Song> {

    private static ApiMethodSearch: string = 'core.library.search';

    // : IEnumerable<Song>
    public async GetAll() {
        const songs: Song[] = [];

        const result = await this.Query(SongStore.ApiMethodSearch);

        console.log('Query Result:');
        console.log(result);

        return result;
    }
}
