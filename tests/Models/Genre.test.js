"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var Genre_1 = require("../../src/ts/Models/Genres/Genre");
describe('Genreエンティティ', function () {
    it('Genre.Create: 値割り当てが正しい', function () {
        var iGenre = {
            Id: 1,
            Name: 'Name',
            LowerName: 'lowername',
            Uri: 'uri',
            GenreArtists: [],
            GenreAlbums: []
        };
        var genre = Genre_1.default.Create(iGenre);
        chai.assert.isNotNull(genre);
        chai.assert.equal(iGenre.Id, genre.Id);
        chai.assert.equal(iGenre.Name, genre.Name);
        chai.assert.equal(iGenre.LowerName, genre.LowerName);
        chai.assert.equal(iGenre.Uri, genre.Uri);
        //chai.assert.equal(iTrack.Album, track.Album);
        //chai.assert.equal(iTrack.Artists, track.Artists);
    });
    it('Genre.Create: 空オブジェクトから生成できる', function () {
        var iGenre = {};
        var genre = Genre_1.default.Create(iGenre);
        chai.assert.isNotNull(genre);
        chai.assert.isNull(genre.Id);
        chai.assert.isNull(genre.Name);
        chai.assert.isNull(genre.LowerName);
        chai.assert.isNull(genre.Uri);
    });
    it('Genre.Create: nullを渡すとnullが返ってくる', function () {
        var genre = Genre_1.default.Create(null);
        chai.assert.isNull(genre);
    });
    it('Genre.CreateArray: 値割り当てが正しい', function () {
        var iGenre1 = {
            Id: 1,
            Name: 'Name',
            LowerName: 'lowername',
            Uri: 'uri',
            GenreArtists: [],
            GenreAlbums: []
        };
        var iGenre2 = {
            Id: 2,
            Name: 'Name2',
            LowerName: 'lowername2',
            Uri: 'uri2',
            GenreArtists: [],
            GenreAlbums: []
        };
        var genres = Genre_1.default.CreateArray([iGenre1, iGenre2]);
        chai.assert.isArray(genres);
        chai.assert.equal(genres.length, 2);
        var genre1 = genres[0];
        chai.assert.isNotNull(genre1);
        chai.assert.equal(iGenre1.Id, genre1.Id);
        chai.assert.equal(iGenre1.Name, genre1.Name);
        chai.assert.equal(iGenre1.LowerName, genre1.LowerName);
        chai.assert.equal(iGenre1.Uri, genre1.Uri);
        var genre2 = genres[1];
        chai.assert.isNotNull(genre2);
        chai.assert.equal(iGenre2.Id, genre2.Id);
        chai.assert.equal(iGenre2.Name, genre2.Name);
        chai.assert.equal(iGenre2.LowerName, genre2.LowerName);
        chai.assert.equal(iGenre2.Uri, genre2.Uri);
    });
    it('Genre.CreateArray: 渡し値配列内のnullはスキップされる', function () {
        var iGenre2 = {
            Id: 2,
            Name: 'Name2',
            LowerName: 'lowername2',
            Uri: 'uri2',
            GenreArtists: [],
            GenreAlbums: []
        };
        var genres = Genre_1.default.CreateArray([null, iGenre2]);
        chai.assert.isArray(genres);
        chai.assert.equal(genres.length, 1);
        var genre1 = genres[0];
        chai.assert.isNotNull(genre1);
        chai.assert.equal(iGenre2.Id, genre1.Id);
        chai.assert.equal(iGenre2.Name, genre1.Name);
        chai.assert.equal(iGenre2.LowerName, genre1.LowerName);
        chai.assert.equal(iGenre2.Uri, genre1.Uri);
    });
});
//# sourceMappingURL=Genre.test.js.map