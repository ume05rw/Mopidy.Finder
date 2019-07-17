import * as mocha from 'mocha';
import * as chai from 'chai';
import { default as Track, ITrack } from '../../src/ts/Models/Tracks/Track';
import { default as MopidyTrack } from '../../src/ts/Models/Mopidies/ITrack';


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

        const track1 = tracks[0];
        chai.assert.isNotNull(track1);
        chai.assert.equal(iTrack1.Id, track1.Id);
        chai.assert.equal(iTrack1.Name, track1.Name);
        chai.assert.equal(iTrack1.LowerName, track1.LowerName);
        chai.assert.equal(iTrack1.TlId, track1.TlId);
        chai.assert.equal(iTrack1.DiscNo, track1.DiscNo);
        chai.assert.equal(iTrack1.TrackNo, track1.TrackNo);
        chai.assert.equal(iTrack1.Date, track1.Date);
        chai.assert.equal(iTrack1.Comment, track1.Comment);
        chai.assert.equal(iTrack1.Length, track1.Length);
        chai.assert.equal(iTrack1.BitRate, track1.BitRate);
        chai.assert.equal(iTrack1.LastModified, track1.LastModified);

        const track2 = tracks[1];
        chai.assert.isNotNull(track2);
        chai.assert.equal(iTrack2.Id, track2.Id);
        chai.assert.equal(iTrack2.Name, track2.Name);
        chai.assert.equal(iTrack2.LowerName, track2.LowerName);
        chai.assert.equal(iTrack2.TlId, track2.TlId);
        chai.assert.equal(iTrack2.DiscNo, track2.DiscNo);
        chai.assert.equal(iTrack2.TrackNo, track2.TrackNo);
        chai.assert.equal(iTrack2.Date, track2.Date);
        chai.assert.equal(iTrack2.Comment, track2.Comment);
        chai.assert.equal(iTrack2.Length, track2.Length);
        chai.assert.equal(iTrack2.BitRate, track2.BitRate);
        chai.assert.equal(iTrack2.LastModified, track2.LastModified);

        //chai.assert.equal(iTrack.Album, track.Album);
        //chai.assert.equal(iTrack.Artists, track.Artists);
    });

    it('Track.CreateArray: 渡し値配列内のnullはスキップされる', () => {
        const iTrack2: ITrack = {
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
        const tracks = Track.CreateArray([null, iTrack2]);
        chai.assert.isArray(tracks);
        chai.assert.equal(tracks.length, 1);

        const track1 = tracks[0];
        chai.assert.isNotNull(track1);
        chai.assert.equal(iTrack2.Id, track1.Id);
        chai.assert.equal(iTrack2.Name, track1.Name);
        chai.assert.equal(iTrack2.LowerName, track1.LowerName);
        chai.assert.equal(iTrack2.TlId, track1.TlId);
        chai.assert.equal(iTrack2.DiscNo, track1.DiscNo);
        chai.assert.equal(iTrack2.TrackNo, track1.TrackNo);
        chai.assert.equal(iTrack2.Date, track1.Date);
        chai.assert.equal(iTrack2.Comment, track1.Comment);
        chai.assert.equal(iTrack2.Length, track1.Length);
        chai.assert.equal(iTrack2.BitRate, track1.BitRate);
        chai.assert.equal(iTrack2.LastModified, track1.LastModified);

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

    it('Track.CreateArrayFromMopidy: 値割り当てが正しい', () => {
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

        const track1 = tracks[0];
        chai.assert.isNotNull(track1);
        chai.assert.equal(track1.Name, iTrack1.name);
        chai.assert.equal(track1.TrackNo, iTrack1.track_no);
        chai.assert.equal(track1.DiscNo, iTrack1.disc_no);
        chai.assert.equal(track1.Date, iTrack1.date);
        chai.assert.equal(track1.Length, iTrack1.length);
        chai.assert.equal(track1.BitRate, iTrack1.bitrate);
        chai.assert.equal(track1.Comment, iTrack1.comment);
        chai.assert.equal(track1.LastModified, iTrack1.last_modified);
        chai.assert.isNull(track1.Album);
        chai.assert.isArray(track1.Artists);
        chai.assert.equal(track1.Artists.length, 0);

        const track2 = tracks[1];
        chai.assert.isNotNull(track2);
        chai.assert.equal(track2.Name, iTrack2.name);
        chai.assert.equal(track2.TrackNo, iTrack2.track_no);
        chai.assert.equal(track2.DiscNo, iTrack2.disc_no);
        chai.assert.equal(track2.Date, iTrack2.date);
        chai.assert.equal(track2.Length, iTrack2.length);
        chai.assert.equal(track2.BitRate, iTrack2.bitrate);
        chai.assert.equal(track2.Comment, iTrack2.comment);
        chai.assert.equal(track2.LastModified, iTrack2.last_modified);
        chai.assert.isNull(track2.Album);
        chai.assert.isArray(track2.Artists);
        chai.assert.equal(track2.Artists.length, 0);
    });

    it('Track.CreateArrayFromMopidy: 渡し値配列内のnullはスキップされる', () => {
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

        const track1 = tracks[0];
        chai.assert.isNotNull(track1);
        chai.assert.equal(track1.Name, iTrack1.name);
        chai.assert.equal(track1.TrackNo, iTrack1.track_no);
        chai.assert.equal(track1.DiscNo, iTrack1.disc_no);
        chai.assert.equal(track1.Date, iTrack1.date);
        chai.assert.equal(track1.Length, iTrack1.length);
        chai.assert.equal(track1.BitRate, iTrack1.bitrate);
        chai.assert.equal(track1.Comment, iTrack1.comment);
        chai.assert.equal(track1.LastModified, iTrack1.last_modified);
        chai.assert.isNull(track1.Album);
        chai.assert.isArray(track1.Artists);
        chai.assert.equal(track1.Artists.length, 0);
    });

    it('Track: 各種補助メソッド', () => {

    });
});
