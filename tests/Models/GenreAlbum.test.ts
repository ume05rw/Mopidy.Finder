import * as mocha from 'mocha';
import * as chai from 'chai';
import { default as GenreAlbum, IGenreAlbum } from '../../src/ts/Models/Relations/GenreAlbum';

describe('GenreAlbumエンティティ', () => {

    it('GenreAlbum.Create: 値割り当てが正しい', () => {
        const iGenreAlbum: IGenreAlbum = {
            GenreId: 1,
            AlbumId: 2,
        };
        const genreAlbum = GenreAlbum.Create(iGenreAlbum);
        chai.assert.isNotNull(genreAlbum);
        chai.assert.equal(iGenreAlbum.GenreId, genreAlbum.GenreId);
        chai.assert.equal(iGenreAlbum.AlbumId, genreAlbum.AlbumId);
    });

    it('GenreAlbum.Create: 空オブジェクトから生成できる', () => {
        const iGenreAlbum = {} as IGenreAlbum;
        const genreAlbum = GenreAlbum.Create(iGenreAlbum);
        chai.assert.isNotNull(genreAlbum);
        chai.assert.isNull(genreAlbum.GenreId);
        chai.assert.isNull(genreAlbum.AlbumId);
    });

    it('GenreAlbum.Create: nullを渡すとnullが返ってくる', () => {
        const genreAlbum = GenreAlbum.Create(null);
        chai.assert.isNull(genreAlbum);
    });

    it('GenreAlbum.CreateArray: 値割り当てが正しい', () => {
        const iGenreAlbum1: IGenreAlbum = {
            GenreId: 1,
            AlbumId: 2,
        };
        const iGenreAlbum2: IGenreAlbum = {
            GenreId: 3,
            AlbumId: 4,
        };
        const genreAlbums = GenreAlbum.CreateArray([iGenreAlbum1, iGenreAlbum2]);
        chai.assert.isArray(genreAlbums);
        chai.assert.equal(genreAlbums.length, 2);

        const genreAlbum1 = genreAlbums[0];
        chai.assert.isNotNull(genreAlbum1);
        chai.assert.equal(iGenreAlbum1.GenreId, genreAlbum1.GenreId);
        chai.assert.equal(iGenreAlbum1.AlbumId, genreAlbum1.AlbumId);

        const genreAlbum2 = genreAlbums[1];
        chai.assert.isNotNull(genreAlbum2);
        chai.assert.equal(iGenreAlbum2.GenreId, genreAlbum2.GenreId);
        chai.assert.equal(iGenreAlbum2.AlbumId, genreAlbum2.AlbumId);
    });

    it('GenreAlbum.CreateArray: 渡し値配列内のnullはスキップされる', () => {
        const iGenreAlbum2: IGenreAlbum = {
            GenreId: 3,
            AlbumId: 4,
        };
        const genreAlbums = GenreAlbum.CreateArray([null, iGenreAlbum2]);
        chai.assert.isArray(genreAlbums);
        chai.assert.equal(genreAlbums.length, 1);

        const genreAlbum1 = genreAlbums[0];
        chai.assert.isNotNull(genreAlbum1);
        chai.assert.equal(iGenreAlbum2.GenreId, genreAlbum1.GenreId);
        chai.assert.equal(iGenreAlbum2.AlbumId, genreAlbum1.AlbumId);
    });
});
