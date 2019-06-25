import * as _ from 'lodash';
import Libraries from '../../Libraries';
import StoreBase from './StoreBase';
import ApiMethods from '../../Definitions/ApiMethods';
import MopidyRef from '../Entities/MopidyRef';
import ArtistAlbum from '../Entities/ArtistAlbum';
import ArtistStore from './ArtistStore';
import AlbumStore from './AlbumStore';
import Artist from '../Entities/Artist';

export default class ArtistAlbumStore extends StoreBase<ArtistAlbum> {

    private _rawEntities: ArtistAlbum[] = [];
    private _artistBelongs: { [artistId: string]: string[] } = {};
    private _albumBelongs: { [albumId: string]: string[] } = {};

    public async Init(artists: ArtistStore, albums: AlbumStore): Promise<boolean> {
        const promises: Promise<boolean>[] = [];
        const artistArray = artists.GetAll();

        _.each(artistArray, async (artist) => {
            promises.push(this.InitArtistAlbums(artist, albums));
        });
        await Promise.all(promises);

        this.Entities = Libraries.Enumerable.from(this._rawEntities);

        return true;
    }

    private async InitArtistAlbums(artist: Artist, albums: AlbumStore): Promise<boolean> {
        const result = await this.Query(ApiMethods.LibraryBrowse, {
            uri: artist.Uri
        });
        const refs: MopidyRef[] = result.result;

        _.each(refs, (ref) => {
            const album = albums
                .Entities
                .firstOrDefault(e => e.Uri === ref.uri);

            if (album) {
                this._rawEntities.push(new ArtistAlbum(artist.Id, album.Id));

                if (!this._artistBelongs[artist.Id])
                    this._artistBelongs[artist.Id] = [];
                if (!this._albumBelongs[album.Id])
                    this._albumBelongs[album.Id] = [];

                if (!_.has(this._artistBelongs[artist.Id], album.Id))
                    this._artistBelongs[artist.Id].push(album.Id);
                if (!_.has(this._albumBelongs[album.Id], artist.Id))
                    this._albumBelongs[album.Id].push(artist.Id);
            }
        });

        return true;
    }
}
