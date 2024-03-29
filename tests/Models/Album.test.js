"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var Album_1 = require("../../src/ts/Models/Albums/Album");
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
    it('Album.CreateArray: 値割り当てが正しい', function () {
        var iAlbum1 = {
            Id: 1,
            Name: 'Name',
            LowerName: 'lowername',
            Uri: 'Uri',
            Year: 2,
            ImageUri: 'ImageUri',
            ArtistAlbums: [],
            GenreAlbums: []
        };
        var iAlbum2 = {
            Id: 3,
            Name: 'Name2',
            LowerName: 'lowername2',
            Uri: 'Uri2',
            Year: 4,
            ImageUri: 'ImageUri2',
            ArtistAlbums: [],
            GenreAlbums: []
        };
        var albums = Album_1.default.CreateArray([iAlbum1, iAlbum2]);
        chai.assert.isArray(albums);
        chai.assert.equal(albums.length, 2);
        var album1 = albums[0];
        chai.assert.isNotNull(album1);
        chai.assert.equal(iAlbum1.Id, album1.Id);
        chai.assert.equal(iAlbum1.Name, album1.Name);
        chai.assert.equal(iAlbum1.LowerName, album1.LowerName);
        chai.assert.equal(iAlbum1.Uri, album1.Uri);
        chai.assert.equal(iAlbum1.Year, album1.Year);
        chai.assert.equal(iAlbum1.ImageUri, album1.ImageUri);
        var album2 = albums[1];
        chai.assert.isNotNull(album2);
        chai.assert.equal(iAlbum2.Id, album2.Id);
        chai.assert.equal(iAlbum2.Name, album2.Name);
        chai.assert.equal(iAlbum2.LowerName, album2.LowerName);
        chai.assert.equal(iAlbum2.Uri, album2.Uri);
        chai.assert.equal(iAlbum2.Year, album2.Year);
        chai.assert.equal(iAlbum2.ImageUri, album2.ImageUri);
    });
    it('Album.CreateArray: 渡し値配列内のnullはスキップされる', function () {
        var iAlbum2 = {
            Id: 1,
            Name: 'Name',
            LowerName: 'lowername',
            Uri: 'Uri',
            Year: 2,
            ImageUri: 'ImageUri',
            ArtistAlbums: [],
            GenreAlbums: []
        };
        var albums = Album_1.default.CreateArray([null, iAlbum2]);
        chai.assert.isArray(albums);
        chai.assert.equal(albums.length, 1);
        var album1 = albums[0];
        chai.assert.isNotNull(album1);
        chai.assert.equal(iAlbum2.Id, album1.Id);
        chai.assert.equal(iAlbum2.Name, album1.Name);
        chai.assert.equal(iAlbum2.LowerName, album1.LowerName);
        chai.assert.equal(iAlbum2.Uri, album1.Uri);
        chai.assert.equal(iAlbum2.Year, album1.Year);
        chai.assert.equal(iAlbum2.ImageUri, album1.ImageUri);
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
    it('Album.CreateArrayFromMopidy: 値割り当てが正しい', function () {
        var iAlbum1 = {
            uri: 'uri1',
            name: 'name1',
            artists: [],
            num_tracks: 1,
            num_discs: 2,
            date: '1999/01/01',
            musicbrainz_id: 'musicbrainz_id1',
            images: ['image1', 'image2']
        };
        var iAlbum2 = {
            uri: 'uri2',
            name: 'name2',
            artists: [],
            num_tracks: 3,
            num_discs: 4,
            date: '2000/01/01',
            musicbrainz_id: 'musicbrainz_id2',
            images: ['image3', 'image4']
        };
        var albums = Album_1.default.CreateArrayFromMopidy([iAlbum1, iAlbum2]);
        chai.assert.isArray(albums);
        chai.assert.equal(albums.length, 2);
        var album1 = albums[0];
        chai.assert.isNotNull(album1);
        chai.assert.isNull(album1.Id);
        chai.assert.equal(album1.Uri, iAlbum1.uri);
        chai.assert.equal(album1.Name, iAlbum1.name);
        chai.assert.equal(album1.LowerName, iAlbum1.name.toLowerCase());
        chai.assert.equal(album1.Year, 1999);
        chai.assert.equal(album1.ImageUri, iAlbum1.images[0]);
        var album2 = albums[1];
        chai.assert.isNotNull(album2);
        chai.assert.isNull(album2.Id);
        chai.assert.equal(album2.Uri, iAlbum2.uri);
        chai.assert.equal(album2.Name, iAlbum2.name);
        chai.assert.equal(album2.LowerName, iAlbum2.name.toLowerCase());
        chai.assert.equal(album2.Year, 2000);
        chai.assert.equal(album2.ImageUri, iAlbum2.images[0]);
    });
    it('Album.CreateArrayFromMopidy: 渡し値配列内のnullはスキップされる', function () {
        var iAlbum2 = {
            uri: 'uri1',
            name: 'name1',
            artists: [],
            num_tracks: 1,
            num_discs: 2,
            date: '1999/01/01',
            musicbrainz_id: 'musicbrainz_id1',
            images: ['image1', 'image2']
        };
        var albums = Album_1.default.CreateArrayFromMopidy([null, iAlbum2]);
        chai.assert.isArray(albums);
        chai.assert.equal(albums.length, 1);
        var album1 = albums[0];
        chai.assert.isNotNull(album1);
        chai.assert.isNull(album1.Id);
        chai.assert.equal(album1.Uri, iAlbum2.uri);
        chai.assert.equal(album1.Name, iAlbum2.name);
        chai.assert.equal(album1.LowerName, iAlbum2.name.toLowerCase());
        chai.assert.equal(album1.Year, 1999);
        chai.assert.equal(album1.ImageUri, iAlbum2.images[0]);
    });
});
//# sourceMappingURL=Album.test.js.map