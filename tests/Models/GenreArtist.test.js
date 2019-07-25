"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var GenreArtist_1 = require("../../src/ts/Models/Relations/GenreArtist");
describe('GenreArtistエンティティ', function () {
    it('GenreArtist.Create: 値割り当てが正しい', function () {
        var iGenreArtist = {
            GenreId: 1,
            ArtistId: 2,
        };
        var genreArtist = GenreArtist_1.default.Create(iGenreArtist);
        chai.assert.isNotNull(genreArtist);
        chai.assert.equal(iGenreArtist.GenreId, genreArtist.GenreId);
        chai.assert.equal(iGenreArtist.ArtistId, genreArtist.ArtistId);
    });
    it('GenreArtist.Create: 空オブジェクトから生成できる', function () {
        var iGenreArtist = {};
        var genreArtist = GenreArtist_1.default.Create(iGenreArtist);
        chai.assert.isNotNull(genreArtist);
        chai.assert.isNull(genreArtist.GenreId);
        chai.assert.isNull(genreArtist.ArtistId);
    });
    it('GenreArtist.Create: nullを渡すとnullが返ってくる', function () {
        var genreArtist = GenreArtist_1.default.Create(null);
        chai.assert.isNull(genreArtist);
    });
    it('GenreArtist.CreateArray: 値割り当てが正しい', function () {
        var iGenreArtist1 = {
            GenreId: 1,
            ArtistId: 2,
        };
        var iGenreArtist2 = {
            GenreId: 3,
            ArtistId: 4,
        };
        var genreArtists = GenreArtist_1.default.CreateArray([iGenreArtist1, iGenreArtist2]);
        chai.assert.isArray(genreArtists);
        chai.assert.equal(genreArtists.length, 2);
        var genreArtist1 = genreArtists[0];
        chai.assert.isNotNull(genreArtist1);
        chai.assert.equal(iGenreArtist1.GenreId, genreArtist1.GenreId);
        chai.assert.equal(iGenreArtist1.ArtistId, genreArtist1.ArtistId);
        var genreArtist2 = genreArtists[1];
        chai.assert.isNotNull(genreArtist2);
        chai.assert.equal(iGenreArtist2.GenreId, genreArtist2.GenreId);
        chai.assert.equal(iGenreArtist2.ArtistId, genreArtist2.ArtistId);
    });
    it('GenreArtist.CreateArray: 渡し値配列内のnullはスキップされる', function () {
        var iGenreArtist2 = {
            GenreId: 3,
            ArtistId: 4,
        };
        var genreArtists = GenreArtist_1.default.CreateArray([null, iGenreArtist2]);
        chai.assert.isArray(genreArtists);
        chai.assert.equal(genreArtists.length, 1);
        var genreArtist1 = genreArtists[0];
        chai.assert.isNotNull(genreArtist1);
        chai.assert.equal(iGenreArtist2.GenreId, genreArtist1.GenreId);
        chai.assert.equal(iGenreArtist2.ArtistId, genreArtist1.ArtistId);
    });
});
//# sourceMappingURL=GenreArtist.test.js.map