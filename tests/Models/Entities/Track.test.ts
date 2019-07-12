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

    it('Track: 各種補助メソッド', () => {

    });
});
