import * as mocha from 'mocha';
import * as chai from 'chai';
import { default as Artist, IArtist } from '../../src/ts/Models/Artists/Artist';
import { default as MopidyArtist } from '../../src/ts/Models/Mopidies/IArtist'

describe('Artistエンティティ', () => {

    it('Artist.Create: 値割り当てが正しい', () => {
        const iArtist: IArtist = {
            Id: 1,
            Name: 'Name',
            LowerName: 'lowername',
            Uri: 'uri',
            ImageUri: 'ImageUri',
            ArtistAlbums: [],
            GenreArtists: [],
        };
        const artist = Artist.Create(iArtist);
        chai.assert.isNotNull(artist);
        chai.assert.equal(iArtist.Id, artist.Id);
        chai.assert.equal(iArtist.Name, artist.Name);
        chai.assert.equal(iArtist.LowerName, artist.LowerName);
        chai.assert.equal(iArtist.Uri, artist.Uri);
        chai.assert.equal(iArtist.ImageUri, artist.ImageUri);

        //chai.assert.equal(iArtist.ArtistAlbums, track.ArtistAlbums);
        //chai.assert.equal(iArtist.GenreArtists, track.GenreArtists);
    });

    it('Artist.Create: 空オブジェクトから生成できる', () => {
        const iArtist = {} as IArtist;
        const artist = Artist.Create(iArtist);
        chai.assert.isNotNull(artist);
        chai.assert.isNull(artist.Id);
        chai.assert.isNull(artist.Name);
        chai.assert.isNull(artist.LowerName);
        chai.assert.isNull(artist.Uri);
        chai.assert.isNull(artist.ImageUri);

        //chai.assert.equal(iArtist.ArtistAlbums, track.ArtistAlbums);
        //chai.assert.equal(iArtist.GenreArtists, track.GenreArtists);
    });

    it('Artist.Create: nullを渡すとnullが返ってくる', () => {
        const artist = Artist.Create(null);
        chai.assert.isNull(artist);
    });

    it('Artist.CreateArray: 値割り当てが正しい', () => {
        const iArtist1: IArtist = {
            Id: 1,
            Name: 'Name',
            LowerName: 'lowername',
            Uri: 'uri',
            ImageUri: 'ImageUri',
            ArtistAlbums: [],
            GenreArtists: [],
        };
        const iArtist2: IArtist = {
            Id: 2,
            Name: 'Name2',
            LowerName: 'lowername2',
            Uri: 'uri2',
            ImageUri: 'ImageUri2',
            ArtistAlbums: [],
            GenreArtists: [],
        };
        const artists = Artist.CreateArray([iArtist1, iArtist2]);
        chai.assert.isArray(artists);
        chai.assert.equal(artists.length, 2);

        const artist1 = artists[0];
        chai.assert.isNotNull(artist1);
        chai.assert.equal(iArtist1.Id, artist1.Id);
        chai.assert.equal(iArtist1.Name, artist1.Name);
        chai.assert.equal(iArtist1.LowerName, artist1.LowerName);
        chai.assert.equal(iArtist1.Uri, artist1.Uri);
        chai.assert.equal(iArtist1.ImageUri, artist1.ImageUri);

        const artist2 = artists[1];
        chai.assert.isNotNull(artist2);
        chai.assert.equal(iArtist2.Id, artist2.Id);
        chai.assert.equal(iArtist2.Name, artist2.Name);
        chai.assert.equal(iArtist2.LowerName, artist2.LowerName);
        chai.assert.equal(iArtist2.Uri, artist2.Uri);
        chai.assert.equal(iArtist2.ImageUri, artist2.ImageUri);
    });

    it('Artist.CreateArray: 渡し値配列内のnullはスキップされる', () => {
        const iArtist2: IArtist = {
            Id: 2,
            Name: 'Name2',
            LowerName: 'lowername2',
            Uri: 'uri2',
            ImageUri: 'ImageUri2',
            ArtistAlbums: [],
            GenreArtists: [],
        };
        const artists = Artist.CreateArray([null, iArtist2]);
        chai.assert.isArray(artists);
        chai.assert.equal(artists.length, 1);

        const artist1 = artists[0];
        chai.assert.isNotNull(artist1);
        chai.assert.equal(iArtist2.Id, artist1.Id);
        chai.assert.equal(iArtist2.Name, artist1.Name);
        chai.assert.equal(iArtist2.LowerName, artist1.LowerName);
        chai.assert.equal(iArtist2.Uri, artist1.Uri);
        chai.assert.equal(iArtist2.ImageUri, artist1.ImageUri);
    });

    it('Artist.CreateFromMopidy: 値割り当てが正しい', () => {
        const iArtist: MopidyArtist = {
            uri: 'uri',
            name: 'name',
            sortname: 'sortname',
            musicbrainz_id: 'musicbrainz_id'
        };
        const artist = Artist.CreateFromMopidy(iArtist);
        chai.assert.isNotNull(artist);
        chai.assert.isNull(artist.Id);
        chai.assert.equal(iArtist.name, artist.Name);
        chai.assert.equal(iArtist.name.toLowerCase(), artist.LowerName);
        chai.assert.equal(iArtist.uri, artist.Uri);
        chai.assert.isNull(artist.ImageUri);
    });

    it('Artist.CreateFromMopidy: 空オブジェクトから生成できる', () => {
        const iArtist = {} as MopidyArtist;
        const artist = Artist.CreateFromMopidy(iArtist);
        chai.assert.isNotNull(artist);
        chai.assert.isNull(artist.Id);
        chai.assert.isNull(artist.Name);
        chai.assert.isNull(artist.LowerName);
        chai.assert.isNull(artist.Uri);
        chai.assert.isNull(artist.ImageUri);
    });

    it('Artist.CreateFromMopidy: nullを渡すとnullが返ってくる', () => {
        const artist = Artist.CreateFromMopidy(null);
        chai.assert.isNull(artist);
    });

    it('Artist.CreateArrayFromMopidy: 値割り当てが正しい', () => {
        const iArtist1: MopidyArtist = {
            uri: 'uri',
            name: 'name',
            sortname: 'sortname',
            musicbrainz_id: 'musicbrainz_id'
        };
        const iArtist2: MopidyArtist = {
            uri: 'uri2',
            name: 'name2',
            sortname: 'sortname2',
            musicbrainz_id: 'musicbrainz_id2'
        };
        const artists = Artist.CreateArrayFromMopidy([iArtist1, iArtist2]);
        chai.assert.isArray(artists)
        chai.assert.equal(artists.length, 2);

        const artist1 = artists[0];
        chai.assert.isNotNull(artist1);
        chai.assert.isNull(artist1.Id);
        chai.assert.equal(iArtist1.name, artist1.Name);
        chai.assert.equal(iArtist1.name.toLowerCase(), artist1.LowerName);
        chai.assert.equal(iArtist1.uri, artist1.Uri);
        chai.assert.isNull(artist1.ImageUri);

        const artist2 = artists[1];
        chai.assert.isNotNull(artist2);
        chai.assert.isNull(artist2.Id);
        chai.assert.equal(iArtist2.name, artist2.Name);
        chai.assert.equal(iArtist2.name.toLowerCase(), artist2.LowerName);
        chai.assert.equal(iArtist2.uri, artist2.Uri);
        chai.assert.isNull(artist2.ImageUri);
    });

    it('Artist.CreateArrayFromMopidy: 渡し値配列内のnullはスキップされる', () => {
        const iArtist2: MopidyArtist = {
            uri: 'uri2',
            name: 'name2',
            sortname: 'sortname2',
            musicbrainz_id: 'musicbrainz_id2'
        };
        const artists = Artist.CreateArrayFromMopidy([null, iArtist2]);
        chai.assert.isArray(artists)
        chai.assert.equal(artists.length, 1);

        const artist1 = artists[0];
        chai.assert.isNotNull(artist1);
        chai.assert.isNull(artist1.Id);
        chai.assert.equal(iArtist2.name, artist1.Name);
        chai.assert.equal(iArtist2.name.toLowerCase(), artist1.LowerName);
        chai.assert.equal(iArtist2.uri, artist1.Uri);
        chai.assert.isNull(artist1.ImageUri);
    });
});
