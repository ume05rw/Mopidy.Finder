import * as mocha from 'mocha';
import * as chai from 'chai';
import IRef from '../../src/ts/Models/Mopidies/IRef';
import Playlist from '../../src/ts/Models/Playlists/Playlist';

describe('Playlistエンティティ', () => {

    it('Playlist.CreateFromRef: 値割り当てが正しい', () => {
        const iRef: IRef = {
            uri: 'uri',
            name: 'name',
            type: 'playlist'
        };
        const playlist = Playlist.CreateFromRef(iRef);
        chai.assert.isNotNull(playlist);
        chai.assert.equal(iRef.uri, playlist.Uri);
        chai.assert.equal(iRef.name, playlist.Name);
        chai.assert.isArray(playlist.Tracks);
        chai.assert.equal(playlist.Tracks.length, 0);
    });

    it('Playlist.CreateFromRef: 空オブジェクトから生成できる', () => {
        const iRef = {} as IRef;
        const playlist = Playlist.CreateFromRef(iRef);
        chai.assert.isNotNull(playlist);
        chai.assert.isNull(playlist.Uri);
        chai.assert.isNull(playlist.Name);
        chai.assert.isArray(playlist.Tracks);
        chai.assert.equal(playlist.Tracks.length, 0);
    });

    it('Playlist.CreateFromRef: nullを渡すとnullが返ってくる', () => {
        const playlist = Playlist.CreateFromRef(null);
        chai.assert.isNull(playlist);
    });

    it('Playlist.CreateArrayFromRefs: 値割り当てが正しい', () => {
        const iRef1: IRef = {
            uri: 'uri',
            name: 'name',
            type: 'playlist'
        };
        const iRef2: IRef = {
            uri: 'uri2',
            name: 'name2',
            type: 'playlist'
        };
        const playlists = Playlist.CreateArrayFromRefs([iRef1, iRef2]);
        chai.assert.isArray(playlists);
        chai.assert.equal(playlists.length, 2);

        const playlists1 = playlists[0];
        chai.assert.isNotNull(playlists1);
        chai.assert.equal(iRef1.uri, playlists1.Uri);
        chai.assert.equal(iRef1.name, playlists1.Name);
        chai.assert.isArray(playlists1.Tracks);
        chai.assert.equal(playlists1.Tracks.length, 0);

        const playlists2 = playlists[1];
        chai.assert.isNotNull(playlists2);
        chai.assert.equal(iRef2.uri, playlists2.Uri);
        chai.assert.equal(iRef2.name, playlists2.Name);
        chai.assert.isArray(playlists2.Tracks);
        chai.assert.equal(playlists2.Tracks.length, 0);
    });

    it('Playlist.CreateArrayFromRefs: 渡し値配列内のnullはスキップされる', () => {
        const iRef2: IRef = {
            uri: 'uri2',
            name: 'name2',
            type: 'playlist'
        };
        const playlists = Playlist.CreateArrayFromRefs([null, iRef2]);
        chai.assert.isArray(playlists);
        chai.assert.equal(playlists.length, 1);

        const playlists1 = playlists[0];
        chai.assert.isNotNull(playlists1);
        chai.assert.equal(iRef2.uri, playlists1.Uri);
        chai.assert.equal(iRef2.name, playlists1.Name);
        chai.assert.isArray(playlists1.Tracks);
        chai.assert.equal(playlists1.Tracks.length, 0);
    });
});
