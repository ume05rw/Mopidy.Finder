import * as mocha from 'mocha';
import * as chai from 'chai';
import { default as ArtistAlbum, IArtistAlbum } from '../../src/ts/Models/Relations/ArtistAlbum';

describe('ArtistAlbumエンティティ', () => {

    it('ArtistAlbum.Create: 値割り当てが正しい', () => {
        const iIArtistAlbum: IArtistAlbum = {
            ArtistId: 1,
            AlbumId: 2,
        };
        const artistAlbum = ArtistAlbum.Create(iIArtistAlbum);
        chai.assert.isNotNull(artistAlbum);
        chai.assert.equal(iIArtistAlbum.ArtistId, artistAlbum.ArtistId);
        chai.assert.equal(iIArtistAlbum.AlbumId, artistAlbum.AlbumId);
    });

    it('ArtistAlbum.Create: 空オブジェクトから生成できる', () => {
        const iIArtistAlbum = {} as IArtistAlbum;
        const artistAlbum = ArtistAlbum.Create(iIArtistAlbum);
        chai.assert.isNotNull(artistAlbum);
        chai.assert.isNull(artistAlbum.ArtistId);
        chai.assert.isNull(artistAlbum.AlbumId);
    });

    it('ArtistAlbum.Create: nullを渡すとnullが返ってくる', () => {
        const artistAlbum = ArtistAlbum.Create(null);
        chai.assert.isNull(artistAlbum);
    });

    it('ArtistAlbum.CreateArray: 値割り当てが正しい', () => {
        const iIArtistAlbum1: IArtistAlbum = {
            ArtistId: 1,
            AlbumId: 2,
        };
        const iIArtistAlbum2: IArtistAlbum = {
            ArtistId: 3,
            AlbumId: 4,
        };
        const artistAlbums = ArtistAlbum.CreateArray([iIArtistAlbum1, iIArtistAlbum2]);
        chai.assert.isArray(artistAlbums);
        chai.assert.equal(artistAlbums.length, 2);

        const artistAlbum1 = artistAlbums[0];
        chai.assert.isNotNull(artistAlbum1);
        chai.assert.equal(iIArtistAlbum1.ArtistId, artistAlbum1.ArtistId);
        chai.assert.equal(iIArtistAlbum1.AlbumId, artistAlbum1.AlbumId);

        const artistAlbum2 = artistAlbums[1];
        chai.assert.isNotNull(artistAlbum2);
        chai.assert.equal(iIArtistAlbum2.ArtistId, artistAlbum2.ArtistId);
        chai.assert.equal(iIArtistAlbum2.AlbumId, artistAlbum2.AlbumId);
    });

    it('ArtistAlbum.CreateArray: 渡し値配列内のnullはスキップされる', () => {
        const iIArtistAlbum2: IArtistAlbum = {
            ArtistId: 3,
            AlbumId: 4,
        };
        const artistAlbums = ArtistAlbum.CreateArray([null, iIArtistAlbum2]);
        chai.assert.isArray(artistAlbums);
        chai.assert.equal(artistAlbums.length, 1);

        const artistAlbum1 = artistAlbums[0];
        chai.assert.isNotNull(artistAlbum1);
        chai.assert.equal(iIArtistAlbum2.ArtistId, artistAlbum1.ArtistId);
        chai.assert.equal(iIArtistAlbum2.AlbumId, artistAlbum1.AlbumId);
    });
});
