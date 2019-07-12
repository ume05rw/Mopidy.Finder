import * as mocha from 'mocha';
import * as chai from 'chai';
import { default as Track, ITrack } from '../../../src/ts/Models/Tracks/Track';
import { default as MopidyTrack } from '../../../src/ts/Models/Mopidies/ITrack';


describe('Trackエンティティ', () => {

    it('Track.Create: 値割り当てが正しい', () => {
        const iTrack: ITrack = {
            Id: 1,
            Name: 'Name',
            LowerName: 'lowername',
            Uri: 'uri',
            TlId: 2,
            DiscNo: 3,
            TrackNo: 4,
            Date: '1999/01/02',
            Comment: 'Comment',
            Length: 5,
            BitRate: 6,
            LastModified: 7,
            Album: null,
            Artists: []
        };
        const track = Track.Create(iTrack);
        chai.assert.isNotNull(track);
        chai.assert.equal(iTrack.Id, track.Id);
        chai.assert.equal(iTrack.Name, track.Name);
        chai.assert.equal(iTrack.LowerName, track.LowerName);
        chai.assert.equal(iTrack.TlId, track.TlId);
        chai.assert.equal(iTrack.DiscNo, track.DiscNo);
        chai.assert.equal(iTrack.TrackNo, track.TrackNo);
        chai.assert.equal(iTrack.Date, track.Date);
        chai.assert.equal(iTrack.Comment, track.Comment);
        chai.assert.equal(iTrack.Length, track.Length);
        chai.assert.equal(iTrack.BitRate, track.BitRate);
        chai.assert.equal(iTrack.LastModified, track.LastModified);

        //chai.assert.equal(iTrack.Album, track.Album);
        //chai.assert.equal(iTrack.Artists, track.Artists);
    });

    it('Track.Create: 空オブジェクトから生成できる', () => {
        const iTrack = {} as ITrack;
        const track = Track.Create(iTrack);
        chai.assert.isNotNull(track);
        chai.assert.isNull(track.Id);
        chai.assert.isNull(track.Name);
        chai.assert.isNull(track.LowerName);
        chai.assert.isNull(track.TlId);
        chai.assert.isNull(track.DiscNo);
        chai.assert.isNull(track.TrackNo);
        chai.assert.isNull(track.Date);
        chai.assert.isNull(track.Comment);
        chai.assert.isNull(track.Length);
        chai.assert.isNull(track.BitRate);
        chai.assert.isNull(track.LastModified);
        chai.assert.isNull(track.Album);
        chai.assert.isArray(track.Artists);
        chai.assert.equal(track.Artists.length, 0);
    });

    it('Track.Create: nullを渡すとnullが返ってくる', () => {
        const track = Track.Create(null);
        chai.assert.isNull(track);
    });


    it('Track.CreateArray: 値割り当てが正しい', () => {
        const iTrack1: ITrack = {
            Id: 1,
            Name: 'Name',
            LowerName: 'lowername',
            Uri: 'uri',
            TlId: 2,
            DiscNo: 3,
            TrackNo: 4,
            Date: '1999/01/02',
            Comment: 'Comment',
            Length: 5,
            BitRate: 6,
            LastModified: 7,
            Album: null,
            Artists: []
        };
        const iTrack2: ITrack = {
            Id: 8,
            Name: 'Name2',
            LowerName: 'lowername2',
            Uri: 'uri2',
            TlId: 9,
            DiscNo: 10,
            TrackNo: 11,
            Date: '2000/01/02',
            Comment: 'Comment2',
            Length: 12,
            BitRate: 13,
            LastModified: 14,
            Album: null,
            Artists: []
        };
        const tracks = Track.CreateArray([iTrack1, iTrack2]);
        chai.assert.isArray(tracks);
        chai.assert.equal(tracks.length, 2);

        chai.assert.isNotNull(tracks[0]);
        chai.assert.equal(iTrack1.Id, tracks[0].Id);
        chai.assert.equal(iTrack1.Name, tracks[0].Name);
        chai.assert.equal(iTrack1.LowerName, tracks[0].LowerName);
        chai.assert.equal(iTrack1.TlId, tracks[0].TlId);
        chai.assert.equal(iTrack1.DiscNo, tracks[0].DiscNo);
        chai.assert.equal(iTrack1.TrackNo, tracks[0].TrackNo);
        chai.assert.equal(iTrack1.Date, tracks[0].Date);
        chai.assert.equal(iTrack1.Comment, tracks[0].Comment);
        chai.assert.equal(iTrack1.Length, tracks[0].Length);
        chai.assert.equal(iTrack1.BitRate, tracks[0].BitRate);
        chai.assert.equal(iTrack1.LastModified, tracks[0].LastModified);

        chai.assert.isNotNull(tracks[1]);
        chai.assert.equal(iTrack2.Id, tracks[1].Id);
        chai.assert.equal(iTrack2.Name, tracks[1].Name);
        chai.assert.equal(iTrack2.LowerName, tracks[1].LowerName);
        chai.assert.equal(iTrack2.TlId, tracks[1].TlId);
        chai.assert.equal(iTrack2.DiscNo, tracks[1].DiscNo);
        chai.assert.equal(iTrack2.TrackNo, tracks[1].TrackNo);
        chai.assert.equal(iTrack2.Date, tracks[1].Date);
        chai.assert.equal(iTrack2.Comment, tracks[1].Comment);
        chai.assert.equal(iTrack2.Length, tracks[1].Length);
        chai.assert.equal(iTrack2.BitRate, tracks[1].BitRate);
        chai.assert.equal(iTrack2.LastModified, tracks[1].LastModified);

        //chai.assert.equal(iTrack.Album, track.Album);
        //chai.assert.equal(iTrack.Artists, track.Artists);
    });

    it('Track.CreateArray: 渡し値配列内のnullはスキップされる', () => {
        const iTrack1: ITrack = {
            Id: 1,
            Name: 'Name',
            LowerName: 'lowername',
            Uri: 'uri',
            TlId: 2,
            DiscNo: 3,
            TrackNo: 4,
            Date: '1999/01/02',
            Comment: 'Comment',
            Length: 5,
            BitRate: 6,
            LastModified: 7,
            Album: null,
            Artists: []
        };
        const tracks = Track.CreateArray([null, iTrack1]);
        chai.assert.isArray(tracks);
        chai.assert.equal(tracks.length, 1);

        chai.assert.isNotNull(tracks[0]);
        chai.assert.equal(iTrack1.Id, tracks[0].Id);
        chai.assert.equal(iTrack1.Name, tracks[0].Name);
        chai.assert.equal(iTrack1.LowerName, tracks[0].LowerName);
        chai.assert.equal(iTrack1.TlId, tracks[0].TlId);
        chai.assert.equal(iTrack1.DiscNo, tracks[0].DiscNo);
        chai.assert.equal(iTrack1.TrackNo, tracks[0].TrackNo);
        chai.assert.equal(iTrack1.Date, tracks[0].Date);
        chai.assert.equal(iTrack1.Comment, tracks[0].Comment);
        chai.assert.equal(iTrack1.Length, tracks[0].Length);
        chai.assert.equal(iTrack1.BitRate, tracks[0].BitRate);
        chai.assert.equal(iTrack1.LastModified, tracks[0].LastModified);

        //chai.assert.equal(iTrack.Album, track.Album);
        //chai.assert.equal(iTrack.Artists, track.Artists);
    });


    it('Track.CreateFromMopidy: 値割り当てが正しい', () => {
        const iTrack: MopidyTrack = {
            uri: 'uri',
            name: 'name',
            album: null,
            artists: [],
            composers: [],
            performers: [],
            genre: 'genre',
            track_no: 1,
            disc_no: 2,
            date: '1999/01/01',
            length: 3,
            bitrate: 4,
            comment: 'comment',
            musicbrainz_id: 'musicbrainz_id',
            last_modified: 6
        };
        const track = Track.CreateFromMopidy(iTrack);
        chai.assert.isNotNull(track);
        chai.assert.equal(track.Name, iTrack.name);
        chai.assert.equal(track.TrackNo, iTrack.track_no);
        chai.assert.equal(track.DiscNo, iTrack.disc_no);
        chai.assert.equal(track.Date, iTrack.date);
        chai.assert.equal(track.Length, iTrack.length);
        chai.assert.equal(track.BitRate, iTrack.bitrate);
        chai.assert.equal(track.Comment, iTrack.comment);
        chai.assert.equal(track.LastModified, iTrack.last_modified);
        chai.assert.isNull(track.Album);
        chai.assert.isArray(track.Artists);
        chai.assert.equal(track.Artists.length, 0);
    });

    it('Track.CreateFromMopidy: 空オブジェクトから生成できる', () => {
        const iTrack1 = {} as MopidyTrack;
        const track = Track.CreateFromMopidy(iTrack1);
        chai.assert.isNotNull(track);
        chai.assert.isNull(track.Id);
        chai.assert.isNull(track.Name);
        chai.assert.isNull(track.LowerName);
        chai.assert.isNull(track.TlId);
        chai.assert.isNull(track.DiscNo);
        chai.assert.isNull(track.TrackNo);
        chai.assert.isNull(track.Date);
        chai.assert.isNull(track.Comment);
        chai.assert.isNull(track.Length);
        chai.assert.isNull(track.BitRate);
        chai.assert.isNull(track.LastModified);
        chai.assert.isNull(track.Album);
        chai.assert.isArray(track.Artists);
        chai.assert.equal(track.Artists.length, 0);
    });

    it('Track.CreateFromMopidy: nullを渡すとnullが返ってくる', () => {
        const track = Track.CreateFromMopidy(null);
        chai.assert.isNull(track);
    });

    it('Track.CreateFromMopidy: 値割り当てが正しい', () => {
        const iTrack1: MopidyTrack = {
            uri: 'uri',
            name: 'name',
            album: null,
            artists: [],
            composers: [],
            performers: [],
            genre: 'genre',
            track_no: 1,
            disc_no: 2,
            date: '1999/01/01',
            length: 3,
            bitrate: 4,
            comment: 'comment',
            musicbrainz_id: 'musicbrainz_id',
            last_modified: 6
        };
        const iTrack2: MopidyTrack = {
            uri: 'uri2',
            name: 'name2',
            album: null,
            artists: [],
            composers: [],
            performers: [],
            genre: 'genre2',
            track_no: 7,
            disc_no: 8,
            date: '2000/01/01',
            length: 9,
            bitrate: 10,
            comment: 'comment2',
            musicbrainz_id: 'musicbrainz_id2',
            last_modified: 11
        };
        const tracks = Track.CreateArrayFromMopidy([iTrack1, iTrack2]);
        chai.assert.isArray(tracks)
        chai.assert.equal(tracks.length, 2);

        chai.assert.isNotNull(tracks[0]);
        chai.assert.equal(tracks[0].Name, iTrack1.name);
        chai.assert.equal(tracks[0].TrackNo, iTrack1.track_no);
        chai.assert.equal(tracks[0].DiscNo, iTrack1.disc_no);
        chai.assert.equal(tracks[0].Date, iTrack1.date);
        chai.assert.equal(tracks[0].Length, iTrack1.length);
        chai.assert.equal(tracks[0].BitRate, iTrack1.bitrate);
        chai.assert.equal(tracks[0].Comment, iTrack1.comment);
        chai.assert.equal(tracks[0].LastModified, iTrack1.last_modified);
        chai.assert.isNull(tracks[0].Album);
        chai.assert.isArray(tracks[0].Artists);
        chai.assert.equal(tracks[0].Artists.length, 0);

        chai.assert.isNotNull(tracks[1]);
        chai.assert.equal(tracks[1].Name, iTrack2.name);
        chai.assert.equal(tracks[1].TrackNo, iTrack2.track_no);
        chai.assert.equal(tracks[1].DiscNo, iTrack2.disc_no);
        chai.assert.equal(tracks[1].Date, iTrack2.date);
        chai.assert.equal(tracks[1].Length, iTrack2.length);
        chai.assert.equal(tracks[1].BitRate, iTrack2.bitrate);
        chai.assert.equal(tracks[1].Comment, iTrack2.comment);
        chai.assert.equal(tracks[1].LastModified, iTrack2.last_modified);
        chai.assert.isNull(tracks[1].Album);
        chai.assert.isArray(tracks[1].Artists);
        chai.assert.equal(tracks[1].Artists.length, 0);
    });

    it('Track.CreateFromMopidy: 渡し値配列内のnullはスキップされる', () => {
        const iTrack1: MopidyTrack = {
            uri: 'uri',
            name: 'name',
            album: null,
            artists: [],
            composers: [],
            performers: [],
            genre: 'genre',
            track_no: 1,
            disc_no: 2,
            date: '1999/01/01',
            length: 3,
            bitrate: 4,
            comment: 'comment',
            musicbrainz_id: 'musicbrainz_id',
            last_modified: 6
        };

        const tracks = Track.CreateArrayFromMopidy([null, iTrack1]);
        chai.assert.isArray(tracks)
        chai.assert.equal(tracks.length, 1);
        chai.assert.isNotNull(tracks[0]);
        chai.assert.equal(tracks[0].Name, iTrack1.name);
        chai.assert.equal(tracks[0].TrackNo, iTrack1.track_no);
        chai.assert.equal(tracks[0].DiscNo, iTrack1.disc_no);
        chai.assert.equal(tracks[0].Date, iTrack1.date);
        chai.assert.equal(tracks[0].Length, iTrack1.length);
        chai.assert.equal(tracks[0].BitRate, iTrack1.bitrate);
        chai.assert.equal(tracks[0].Comment, iTrack1.comment);
        chai.assert.equal(tracks[0].LastModified, iTrack1.last_modified);
        chai.assert.isNull(tracks[0].Album);
        chai.assert.isArray(tracks[0].Artists);
        chai.assert.equal(tracks[0].Artists.length, 0);
    });

    it('Track: 各種補助メソッド', () => {

    });
});
