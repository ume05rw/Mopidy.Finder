"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var Album_1 = require("../../../src/ts/Models/Albums/Album");
describe('Albumエンティティ', function () {
    it('Album.Create: 値割り当てが正しい', function () {
        var iAlbum = {
            Id: 1,
            Name: 'Name',
            LowerName: 'lowername',
            Uri: 'Uri',
            Year: 2,
            ImageUri: 'ImageUri',
            ArtistAlbums: [],
            GenreAlbums: []
        };
        var album = Album_1.default.Create(iAlbum);
        chai.assert.isNotNull(album);
        chai.assert.equal(iAlbum.Id, album.Id);
        chai.assert.equal(iAlbum.Name, album.Name);
        chai.assert.equal(iAlbum.LowerName, album.LowerName);
        chai.assert.equal(iAlbum.Uri, album.Uri);
        chai.assert.equal(iAlbum.Year, album.Year);
        chai.assert.equal(iAlbum.ImageUri, album.ImageUri);
        //chai.assert.equal(iAlbum.Id, album.Id);
        //chai.assert.equal(iAlbum.Id, album.Id);
    });
    it('Album.Create: 空オブジェクトから生成できる', function () {
        var iAlbum = {};
        var album = Album_1.default.Create(iAlbum);
        chai.assert.isNotNull(album);
        chai.assert.isNull(album.Id);
        chai.assert.isNull(album.Name);
        chai.assert.isNull(album.LowerName);
        chai.assert.isNull(album.Uri);
        chai.assert.isNull(album.Year);
        chai.assert.isNull(album.ImageUri);
        chai.assert.isArray(album.ArtistAlbums);
        chai.assert.equal(album.ArtistAlbums.length, 0);
        chai.assert.isArray(album.GenreAlbums);
        chai.assert.equal(album.GenreAlbums.length, 0);
    });
    it('Album.Create: nullを渡すとnullが返ってくる', function () {
        var album = Album_1.default.Create(null);
        chai.assert.isNull(album);
    });
    it('Album.CreateFromMopidy: 値割り当てが正しい', function () {
        var iAlbum = {
            uri: 'uri',
            name: 'name',
            artists: [],
            num_tracks: 1,
            num_discs: 2,
            date: '1999/01/01',
            musicbrainz_id: 'musicbrainz_id',
            images: ['image']
        };
        var album = Album_1.default.CreateFromMopidy(iAlbum);
        chai.assert.isNotNull(album);
        chai.assert.isNull(album.Id);
        chai.assert.equal(album.Uri, iAlbum.uri);
        chai.assert.equal(album.Name, iAlbum.name);
        chai.assert.equal(album.LowerName, iAlbum.name.toLowerCase());
        chai.assert.equal(album.Year, 1999);
        chai.assert.equal(album.ImageUri, iAlbum.images[0]);
    });
    it('Album.CreateFromMopidy: 空オブジェクトから生成できる', function () {
        var iAlbum = {};
        var album = Album_1.default.CreateFromMopidy(iAlbum);
        chai.assert.isNotNull(album);
        chai.assert.isNull(album.Id);
        chai.assert.isNull(album.Name);
        chai.assert.isNull(album.LowerName);
        chai.assert.isNull(album.Uri);
        chai.assert.isNull(album.Year);
        chai.assert.isNull(album.ImageUri);
        chai.assert.isArray(album.ArtistAlbums);
        chai.assert.equal(album.ArtistAlbums.length, 0);
        chai.assert.isArray(album.GenreAlbums);
        chai.assert.equal(album.GenreAlbums.length, 0);
    });
    it('Album.CreateFromMopidy: nullを渡すとnullが返ってくる', function () {
        var album = Album_1.default.CreateFromMopidy(null);
        chai.assert.isNull(album);
    });
});
//# sourceMappingURL=Album.test.js.map