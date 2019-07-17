import * as mocha from 'mocha';
import * as chai from 'chai';
import { default as GenreArtist, IGenreArtist } from '../../src/ts/Models/Relations/GenreArtist';

describe('GenreArtistエンティティ', () => {

    it('GenreArtist.Create: 値割り当てが正しい', () => {
        const iGenreArtist: IGenreArtist = {
            GenreId: 1,
            ArtistId: 2,
        };
        const genreArtist = GenreArtist.Create(iGenreArtist);
        chai.assert.isNotNull(genreArtist);
        chai.assert.equal(iGenreArtist.GenreId, genreArtist.GenreId);
        chai.assert.equal(iGenreArtist.ArtistId, genreArtist.ArtistId);
    });

    it('GenreArtist.Create: 空オブジェクトから生成できる', () => {
        const iGenreArtist = {} as IGenreArtist;
        const genreArtist = GenreArtist.Create(iGenreArtist);
        chai.assert.isNotNull(genreArtist);
        chai.assert.isNull(genreArtist.GenreId);
        chai.assert.isNull(genreArtist.ArtistId);
    });

    it('GenreArtist.Create: nullを渡すとnullが返ってくる', () => {
        const genreArtist = GenreArtist.Create(null);
        chai.assert.isNull(genreArtist);
    });

    it('GenreArtist.CreateArray: 値割り当てが正しい', () => {
        const iGenreArtist1: IGenreArtist = {
            GenreId: 1,
            ArtistId: 2,
        };
        const iGenreArtist2: IGenreArtist = {
            GenreId: 3,
            ArtistId: 4,
        };
        const genreArtists = GenreArtist.CreateArray([iGenreArtist1, iGenreArtist2]);
        chai.assert.isArray(genreArtists);
        chai.assert.equal(genreArtists.length, 2);

        const genreArtist1 = genreArtists[0];
        chai.assert.isNotNull(genreArtist1);
        chai.assert.equal(iGenreArtist1.GenreId, genreArtist1.GenreId);
        chai.assert.equal(iGenreArtist1.ArtistId, genreArtist1.ArtistId);

        const genreArtist2 = genreArtists[1];
        chai.assert.isNotNull(genreArtist2);
        chai.assert.equal(iGenreArtist2.GenreId, genreArtist2.GenreId);
        chai.assert.equal(iGenreArtist2.ArtistId, genreArtist2.ArtistId);
    });

    it('GenreArtist.CreateArray: 渡し値配列内のnullはスキップされる', () => {
        const iGenreArtist2: IGenreArtist = {
            GenreId: 3,
            ArtistId: 4,
        };
        const genreArtists = GenreArtist.CreateArray([null, iGenreArtist2]);
        chai.assert.isArray(genreArtists);
        chai.assert.equal(genreArtists.length, 1);

        const genreArtist1 = genreArtists[0];
        chai.assert.isNotNull(genreArtist1);
        chai.assert.equal(iGenreArtist2.GenreId, genreArtist1.GenreId);
        chai.assert.equal(iGenreArtist2.ArtistId, genreArtist1.ArtistId);
    });
});
