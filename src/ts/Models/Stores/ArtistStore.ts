import * as _ from 'lodash';
import Libraries from '../../Libraries';
import StoreBase from './StoreBase';
import ApiMethods from '../../Definitions/ApiMethods';
import MopidyRef from '../Entities/MopidyRef';
import Artist from '../Entities/Artist';
import AlbumStore from './AlbumStore';

export default class ArtistStore extends StoreBase<Artist> {

    public async Init(albums: AlbumStore): Promise<boolean> {
        const entities: Artist[] = [];

        const result = await this.Query(ApiMethods.LibraryBrowse, {
            uri: 'local:directory?type=artist'
        });
        const refs: MopidyRef[] = result.result;

        const promises: Promise<boolean>[] = [];
        _.each(refs, async (ref) => {
            promises.push(new Promise<boolean>(async (resolve: (value: boolean) => void) => {
                const artist = new Artist(ref.name, ref.uri);
                entities.push(artist);

                const related = await this.Query(ApiMethods.LibraryBrowse, {
                    uri: artist.Uri
                });
                const relRefs: MopidyRef[] = related.result;
                _.each(relRefs, (relRef) => {
                    const relatedAlbums = albums
                        .Entities
                        .firstOrDefault(e => e.Uri === relRef.uri);

                    if (relatedAlbums)
                        relatedAlbums.SetArtistId(artist.Id);
                });

                resolve(true);
            }));
        });

        await Promise.all(promises);

        this.Entities = Libraries.Enumerable.from(entities);

        return true;
    }
}
