import * as mocha from 'mocha';
import * as chai from 'chai';
import { default as Genre, IGenre } from '../../src/ts/Models/Genres/Genre';

describe('Genreエンティティ', () => {

    it('Genre.Create: 値割り当てが正しい', () => {
        const iGenre: IGenre = {
            Id: 1,
            Name: 'Name',
            LowerName: 'lowername',
            Uri: 'uri',
            GenreArtists: [],
            GenreAlbums: []
        };
        const genre = Genre.Create(iGenre);
        chai.assert.isNotNull(genre);
        chai.assert.equal(iGenre.Id, genre.Id);
        chai.assert.equal(iGenre.Name, genre.Name);
        chai.assert.equal(iGenre.LowerName, genre.LowerName);
        chai.assert.equal(iGenre.Uri, genre.Uri);

        //chai.assert.equal(iTrack.Album, track.Album);
        //chai.assert.equal(iTrack.Artists, track.Artists);
    });

    it('Genre.Create: 空オブジェクトから生成できる', () => {
        const iGenre = {} as IGenre;
        const genre = Genre.Create(iGenre);
        chai.assert.isNotNull(genre);
        chai.assert.isNull(genre.Id);
        chai.assert.isNull(genre.Name);
        chai.assert.isNull(genre.LowerName);
        chai.assert.isNull(genre.Uri);
    });


    it('Genre.Create: nullを渡すとnullが返ってくる', () => {
        const genre = Genre.Create(null);
        chai.assert.isNull(genre);
    });

    it('Genre.CreateArray: 値割り当てが正しい', () => {
        const iGenre1: IGenre = {
            Id: 1,
            Name: 'Name',
            LowerName: 'lowername',
            Uri: 'uri',
            GenreArtists: [],
            GenreAlbums: []
        };
        const iGenre2: IGenre = {
            Id: 2,
            Name: 'Name2',
            LowerName: 'lowername2',
            Uri: 'uri2',
            GenreArtists: [],
            GenreAlbums: []
        };
        const genres = Genre.CreateArray([iGenre1, iGenre2]);
        chai.assert.isArray(genres);
        chai.assert.equal(genres.length, 2);

        const genre1 = genres[0];
        chai.assert.isNotNull(genre1);
        chai.assert.equal(iGenre1.Id, genre1.Id);
        chai.assert.equal(iGenre1.Name, genre1.Name);
        chai.assert.equal(iGenre1.LowerName, genre1.LowerName);
        chai.assert.equal(iGenre1.Uri, genre1.Uri);

        const genre2 = genres[1];
        chai.assert.isNotNull(genre2);
        chai.assert.equal(iGenre2.Id, genre2.Id);
        chai.assert.equal(iGenre2.Name, genre2.Name);
        chai.assert.equal(iGenre2.LowerName, genre2.LowerName);
        chai.assert.equal(iGenre2.Uri, genre2.Uri);
    });

    it('Genre.CreateArray: 渡し値配列内のnullはスキップされる', () => {
        const iGenre2: IGenre = {
            Id: 2,
            Name: 'Name2',
            LowerName: 'lowername2',
            Uri: 'uri2',
            GenreArtists: [],
            GenreAlbums: []
        };
        const genres = Genre.CreateArray([null, iGenre2]);
        chai.assert.isArray(genres);
        chai.assert.equal(genres.length, 1);

        const genre1 = genres[0];
        chai.assert.isNotNull(genre1);
        chai.assert.equal(iGenre2.Id, genre1.Id);
        chai.assert.equal(iGenre2.Name, genre1.Name);
        chai.assert.equal(iGenre2.LowerName, genre1.LowerName);
        chai.assert.equal(iGenre2.Uri, genre1.Uri);
    });
});
