"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var Playlist_1 = require("../../src/ts/Models/Playlists/Playlist");
describe('Playlistエンティティ', function () {
    it('Playlist.CreateFromRef: 値割り当てが正しい', function () {
        var iRef = {
            uri: 'uri',
            name: 'name',
            type: 'playlist'
        };
        var playlist = Playlist_1.default.CreateFromRef(iRef);
        chai.assert.isNotNull(playlist);
        chai.assert.equal(iRef.uri, playlist.Uri);
        chai.assert.equal(iRef.name, playlist.Name);
        chai.assert.isArray(playlist.Tracks);
        chai.assert.equal(playlist.Tracks.length, 0);
    });
    it('Playlist.CreateFromRef: 空オブジェクトから生成できる', function () {
        var iRef = {};
        var playlist = Playlist_1.default.CreateFromRef(iRef);
        chai.assert.isNotNull(playlist);
        chai.assert.isNull(playlist.Uri);
        chai.assert.isNull(playlist.Name);
        chai.assert.isArray(playlist.Tracks);
        chai.assert.equal(playlist.Tracks.length, 0);
    });
    it('Playlist.CreateFromRef: nullを渡すとnullが返ってくる', function () {
        var playlist = Playlist_1.default.CreateFromRef(null);
        chai.assert.isNull(playlist);
    });
    it('Playlist.CreateArrayFromRefs: 値割り当てが正しい', function () {
        var iRef1 = {
            uri: 'uri',
            name: 'name',
            type: 'playlist'
        };
        var iRef2 = {
            uri: 'uri2',
            name: 'name2',
            type: 'playlist'
        };
        var playlists = Playlist_1.default.CreateArrayFromRefs([iRef1, iRef2]);
        chai.assert.isArray(playlists);
        chai.assert.equal(playlists.length, 2);
        var playlists1 = playlists[0];
        chai.assert.isNotNull(playlists1);
        chai.assert.equal(iRef1.uri, playlists1.Uri);
        chai.assert.equal(iRef1.name, playlists1.Name);
        chai.assert.isArray(playlists1.Tracks);
        chai.assert.equal(playlists1.Tracks.length, 0);
        var playlists2 = playlists[1];
        chai.assert.isNotNull(playlists2);
        chai.assert.equal(iRef2.uri, playlists2.Uri);
        chai.assert.equal(iRef2.name, playlists2.Name);
        chai.assert.isArray(playlists2.Tracks);
        chai.assert.equal(playlists2.Tracks.length, 0);
    });
    it('Playlist.CreateArrayFromRefs: 渡し値配列内のnullはスキップされる', function () {
        var iRef2 = {
            uri: 'uri2',
            name: 'name2',
            type: 'playlist'
        };
        var playlists = Playlist_1.default.CreateArrayFromRefs([null, iRef2]);
        chai.assert.isArray(playlists);
        chai.assert.equal(playlists.length, 1);
        var playlists1 = playlists[0];
        chai.assert.isNotNull(playlists1);
        chai.assert.equal(iRef2.uri, playlists1.Uri);
        chai.assert.equal(iRef2.name, playlists1.Name);
        chai.assert.isArray(playlists1.Tracks);
        chai.assert.equal(playlists1.Tracks.length, 0);
    });
});
//# sourceMappingURL=Playlist.test.js.map