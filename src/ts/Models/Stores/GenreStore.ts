import * as _ from 'lodash';
import Libraries from '../../Libraries';
import StoreBase from './StoreBase';
import ApiMethods from '../../Definitions/ApiMethods';
import MopidyRef from '../Entities/MopidyRef';
import Genre from '../Entities/Genre';

export default class GenreStore extends StoreBase<Genre> {

    public async Init(): Promise<boolean> {
        const entities: Genre[] = [];

        const result = await this.Query(ApiMethods.LibraryBrowse, {
            uri: 'local:directory?type=genre'
        });
        const refs: MopidyRef[] = result.result;

        _.each(refs, async (ref) => {
            const genre = new Genre(ref.name, ref.uri);
            entities.push(genre);

            //const related = await this.Query(ApiMethods.LibraryBrowse, {
            //    uri: 'local:directory?type=artist'
            //});
        });

        this.Entities = Libraries.Enumerable.from(entities);

        return true;
    }
}
