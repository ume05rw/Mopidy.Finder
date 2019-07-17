"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var GenreAlbum_1 = require("../../src/ts/Models/Relations/GenreAlbum");
describe('GenreAlbumエンティティ', function () {
    it('GenreAlbum.Create: 値割り当てが正しい', function () {
        var iGenreAlbum = {
            GenreId: 1,
            AlbumId: 2,
        };
        var genreAlbum = GenreAlbum_1.default.Create(iGenreAlbum);
        chai.assert.isNotNull(genreAlbum);
        chai.assert.equal(iGenreAlbum.GenreId, genreAlbum.GenreId);
        chai.assert.equal(iGenreAlbum.AlbumId, genreAlbum.AlbumId);
    });
    it('GenreAlbum.Create: 空オブジェクトから生成できる', function () {
        var iGenreAlbum = {};
        var genreAlbum = GenreAlbum_1.default.Create(iGenreAlbum);
        chai.assert.isNotNull(genreAlbum);
        chai.assert.isNull(genreAlbum.GenreId);
        chai.assert.isNull(genreAlbum.AlbumId);
    });
    it('GenreAlbum.Create: nullを渡すとnullが返ってくる', function () {
        var genreAlbum = GenreAlbum_1.default.Create(null);
        chai.assert.isNull(genreAlbum);
    });
    it('GenreAlbum.CreateArray: 値割り当てが正しい', function () {
        var iGenreAlbum1 = {
            GenreId: 1,
            AlbumId: 2,
        };
        var iGenreAlbum2 = {
            GenreId: 3,
            AlbumId: 4,
        };
        var genreAlbums = GenreAlbum_1.default.CreateArray([iGenreAlbum1, iGenreAlbum2]);
        chai.assert.isArray(genreAlbums);
        chai.assert.equal(genreAlbums.length, 2);
        var genreAlbum1 = genreAlbums[0];
        chai.assert.isNotNull(genreAlbum1);
        chai.assert.equal(iGenreAlbum1.GenreId, genreAlbum1.GenreId);
        chai.assert.equal(iGenreAlbum1.AlbumId, genreAlbum1.AlbumId);
        var genreAlbum2 = genreAlbums[1];
        chai.assert.isNotNull(genreAlbum2);
        chai.assert.equal(iGenreAlbum2.GenreId, genreAlbum2.GenreId);
        chai.assert.equal(iGenreAlbum2.AlbumId, genreAlbum2.AlbumId);
    });
    it('GenreAlbum.CreateArray: 渡し値配列内のnullはスキップされる', function () {
        var iGenreAlbum2 = {
            GenreId: 3,
            AlbumId: 4,
        };
        var genreAlbums = GenreAlbum_1.default.CreateArray([null, iGenreAlbum2]);
        chai.assert.isArray(genreAlbums);
        chai.assert.equal(genreAlbums.length, 1);
        var genreAlbum1 = genreAlbums[0];
        chai.assert.isNotNull(genreAlbum1);
        chai.assert.equal(iGenreAlbum2.GenreId, genreAlbum1.GenreId);
        chai.assert.equal(iGenreAlbum2.AlbumId, genreAlbum1.AlbumId);
    });
});
//# sourceMappingURL=GenreAlbum.test.js.map