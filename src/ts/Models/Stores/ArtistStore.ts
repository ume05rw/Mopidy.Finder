import * as _ from 'lodash';
import Libraries from '../../Libraries';
import StoreBase from './StoreBase';
import ApiMethods from '../../Definitions/ApiMethods';
import MopidyRef from '../Entities/MopidyRef';
import Artist from '../Entities/Artist';

export default class ArtistStore extends StoreBase<Artist> {

    public async Init(): Promise<boolean> {
        const entities: Artist[] = [];

        const result = await this.Query(ApiMethods.LibraryBrowse, {
            uri: 'local:directory?type=artist'
        });
        const refs: MopidyRef[] = result.result;

        const promises: Promise<boolean>[] = [];
        _.each(refs, async (ref) => {
            const artist = new Artist(ref.name, ref.uri);
            entities.push(artist);
        });

        await Promise.all(promises);

        this.Entities = Libraries.Enumerable.from(entities);

        return true;
    }
}
