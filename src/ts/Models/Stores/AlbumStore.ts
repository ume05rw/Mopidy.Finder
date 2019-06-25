import * as _ from 'lodash';
import Libraries from '../../Libraries';
import StoreBase from './StoreBase';
import ApiMethods from '../../Definitions/ApiMethods';
import MopidyRef from '../Entities/MopidyRef';
import Album from '../Entities/Album';

export default class AlbumStore extends StoreBase<Album> {

    public async Init(): Promise<boolean> {
        const entities: Album[] = [];

        const params = {
            uri: 'local:directory?type=album'
        };
        const result = await this.Query(ApiMethods.LibraryBrowse, params);
        const refs: MopidyRef[] = result.result;

        _.each(refs, (ref) => {
            entities.push(new Album(ref.name, ref.uri));
        });

        this.Entities = Libraries.Enumerable.from(entities);

        return true;
    }
}
