import * as _ from 'lodash';
import Libraries from '../../Libraries';
import StoreBase from './StoreBase';
import ApiMethods from '../../Definitions/ApiMethods';
import MopidyRef from '../Entities/MopidyRef';
import GenreAlbum from '../Entities/GenreAlbum';
import GenreStore from './GenreStore';
import AlbumStore from './AlbumStore';
import Genre from '../Entities/Genre';

export default class GenreAlbumStore extends StoreBase<GenreAlbum> {

    private _rawEntities: GenreAlbum[] = [];
    private _genreBelongs: { [genreId: string]: string[] } = {};
    private _albumBelongs: { [albumId: string]: string[] } = {};

    public async Init(genres: GenreStore, albums: AlbumStore): Promise<boolean> {
        const promises: Promise<boolean>[] = [];
        const genreArray = genres.GetAll();

        _.each(genreArray, async (genre) => {
            promises.push(this.InitGenreAlbums(genre, albums));
        });
        await Promise.all(promises);

        this.Entities = Libraries.Enumerable.from(this._rawEntities);

        return true;
    }

    private async InitGenreAlbums(genre: Genre, albums: AlbumStore): Promise<boolean> {
        const result = await this.Query(ApiMethods.LibraryBrowse, {
            uri: genre.Uri
        });
        const refs: MopidyRef[] = result.result;

        _.each(refs, (ref) => {
            const refQuery = ref.uri.split('?')[1];
            const params = refQuery.split('&');
            let albumUri: string = null;
            for (let i = 0; i < params.length; i++) {
                if (params[i].indexOf('album=') === 0) {
                    albumUri = params[i].split('=')[1];
                    break;
                }
            }

            if (albumUri) {
                const album = albums
                    .Entities
                    .firstOrDefault(e => e.Uri === albumUri);

                if (album) {
                    this._rawEntities.push(new GenreAlbum(genre.Id, album.Id))

                    if (!this._genreBelongs[genre.Id])
                        this._genreBelongs[genre.Id] = [];
                    if (!this._albumBelongs[album.Id])
                        this._albumBelongs[album.Id] = [];

                    if (!_.has(this._genreBelongs[genre.Id], album.Id))
                        this._genreBelongs[genre.Id].push(album.Id);
                    if (!_.has(this._albumBelongs[album.Id], genre.Id))
                        this._albumBelongs[album.Id].push(genre.Id);
                }
            }
        });

        return true;
    }
}
