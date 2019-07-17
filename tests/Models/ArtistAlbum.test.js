"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var ArtistAlbum_1 = require("../../src/ts/Models/Relations/ArtistAlbum");
describe('ArtistAlbumエンティティ', function () {
    it('ArtistAlbum.Create: 値割り当てが正しい', function () {
        var iIArtistAlbum = {
            ArtistId: 1,
            AlbumId: 2,
        };
        var artistAlbum = ArtistAlbum_1.default.Create(iIArtistAlbum);
        chai.assert.isNotNull(artistAlbum);
        chai.assert.equal(iIArtistAlbum.ArtistId, artistAlbum.ArtistId);
        chai.assert.equal(iIArtistAlbum.AlbumId, artistAlbum.AlbumId);
    });
    it('ArtistAlbum.Create: 空オブジェクトから生成できる', function () {
        var iIArtistAlbum = {};
        var artistAlbum = ArtistAlbum_1.default.Create(iIArtistAlbum);
        chai.assert.isNotNull(artistAlbum);
        chai.assert.isNull(artistAlbum.ArtistId);
        chai.assert.isNull(artistAlbum.AlbumId);
    });
    it('ArtistAlbum.Create: nullを渡すとnullが返ってくる', function () {
        var artistAlbum = ArtistAlbum_1.default.Create(null);
        chai.assert.isNull(artistAlbum);
    });
    it('ArtistAlbum.CreateArray: 値割り当てが正しい', function () {
        var iIArtistAlbum1 = {
            ArtistId: 1,
            AlbumId: 2,
        };
        var iIArtistAlbum2 = {
            ArtistId: 3,
            AlbumId: 4,
        };
        var artistAlbums = ArtistAlbum_1.default.CreateArray([iIArtistAlbum1, iIArtistAlbum2]);
        chai.assert.isArray(artistAlbums);
        chai.assert.equal(artistAlbums.length, 2);
        var artistAlbum1 = artistAlbums[0];
        chai.assert.isNotNull(artistAlbum1);
        chai.assert.equal(iIArtistAlbum1.ArtistId, artistAlbum1.ArtistId);
        chai.assert.equal(iIArtistAlbum1.AlbumId, artistAlbum1.AlbumId);
        var artistAlbum2 = artistAlbums[1];
        chai.assert.isNotNull(artistAlbum2);
        chai.assert.equal(iIArtistAlbum2.ArtistId, artistAlbum2.ArtistId);
        chai.assert.equal(iIArtistAlbum2.AlbumId, artistAlbum2.AlbumId);
    });
    it('ArtistAlbum.CreateArray: 渡し値配列内のnullはスキップされる', function () {
        var iIArtistAlbum2 = {
            ArtistId: 3,
            AlbumId: 4,
        };
        var artistAlbums = ArtistAlbum_1.default.CreateArray([null, iIArtistAlbum2]);
        chai.assert.isArray(artistAlbums);
        chai.assert.equal(artistAlbums.length, 1);
        var artistAlbum1 = artistAlbums[0];
        chai.assert.isNotNull(artistAlbum1);
        chai.assert.equal(iIArtistAlbum2.ArtistId, artistAlbum1.ArtistId);
        chai.assert.equal(iIArtistAlbum2.AlbumId, artistAlbum1.AlbumId);
    });
});
//# sourceMappingURL=ArtistAlbum.test.js.map