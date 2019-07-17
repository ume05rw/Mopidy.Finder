import Libraries from '../../Libraries';
import Exception from '../../Utils/Exception';
import AlbumTracks from '../AlbumTracks/AlbumTracks';
import JsonRpcQueryableBase from '../Bases/JsonRpcQueryableBase';
import { default as IPlaylist, default as MopidyPlaylist } from '../Mopidies/IPlaylist';
import IRef from '../Mopidies/IRef';
import ITlTrack from '../Mopidies/ITlTrack';
import Track from '../Tracks/Track';
import TrackStore from '../Tracks/TrackStore';
import Playlist from './Playlist';

export default class PlaylistStore extends JsonRpcQueryableBase {

    private static readonly Methods = {
        PlaylistAsList: 'core.playlists.as_list',
        PlaylistLookup: 'core.playlists.lookup',
        PlaylistCreate: 'core.playlists.create',
        PlaylistSave: 'core.playlists.save',
        PlaylistDelete: 'core.playlists.delete',
        LibraryGetImages: 'core.library.get_images',
        TracklistClearList: 'core.tracklist.clear',
        TracklistAdd: 'core.tracklist.add',
        TracklistGetTlTracks: 'core.tracklist.get_tl_tracks',
        PlaybackPlay: 'core.playback.play'
    }

    public async GetPlaylists(): Promise<Playlist[]> {
        const response
            = await this.JsonRpcRequest(PlaylistStore.Methods.PlaylistAsList);

        const refs = response.result as IRef[];
        const ordered = Libraries.Enumerable.from(refs)
            .orderBy((e): string => e.name)
            .toArray();
        const result = Playlist.CreateArrayFromRefs(ordered);

        return result;
    }

    public async SetPlaylistTracks(playlist: Playlist): Promise<boolean> {
        const response
            = await this.JsonRpcRequest(PlaylistStore.Methods.PlaylistLookup, {
                uri: playlist.Uri
            });

        const mpPlaylist = response.result as IPlaylist;
        // Createしたてでトラック未登録のプレイリストのとき、
        // tracksプロパティが存在しない。
        const tracks = (mpPlaylist.tracks && 0 <= mpPlaylist.tracks.length)
            ? Track.CreateArrayFromMopidy(mpPlaylist.tracks)
            : [];

        if (tracks.length <= 0) {
            playlist.Tracks = [];

            return true;
        }

        const trackStore = new TrackStore();
        await trackStore.EnsureTracks(tracks);

        // 未Ensure状態のtracksをplaylist.TracksにセットするとVueが描画してしまうため、
        // Ensure後にセットする。
        playlist.Tracks = tracks;

        return true;
    }

    public async GetImageUri(uri: string): Promise<string> {
        const resImages
            = await this.JsonRpcRequest(PlaylistStore.Methods.LibraryGetImages, {
                uris: [uri]
            });

        if (resImages.result) {
            const images = resImages.result[uri];
            if (images && 0 < images.length)
                return images[0];
        }

        return null;
    }

    public async PlayPlaylist(playlist: Playlist, track: Track): Promise<boolean> {
        const resClear
            = await this.JsonRpcRequest(PlaylistStore.Methods.TracklistClearList);

        if (resClear.error)
            throw new Error(resClear.error);

        const uris = Libraries.Enumerable.from(playlist.Tracks)
            .select((e): string => e.Uri)
            .toArray();
        const resAdd
            = await this.JsonRpcRequest(PlaylistStore.Methods.TracklistAdd, {
                uris: uris
            });

        if (resAdd.error)
            Exception.Throw('PlaylistStore.PlayPlaylist: Play Failed.', resAdd.error);

        const tlTracks = resAdd.result as ITlTrack[];
        const tlDictionary = Libraries.Enumerable.from(tlTracks)
            .toDictionary<string, number>((e): string => e.track.uri, (e2): number => e2.tlid);

        for (let i = 0; i < playlist.Tracks.length; i++) {
            const tr = playlist.Tracks[i];
            tr.TlId = (tlDictionary.contains(tr.Uri))
                ? tlDictionary.get(tr.Uri)
                : null;
        }

        if (track.TlId === null)
            Exception.Throw(`track: ${track.Name} not assigned TlId`);

        await this.PlayByTlId(track.TlId);

        return true;
    }

    public async PlayByTlId(tlId: number): Promise<boolean> {
        await this.JsonRpcNotice(PlaylistStore.Methods.PlaybackPlay, {
            tlid: tlId
        });

        return true;
    }

    public async AddPlaylist(name: string): Promise<Playlist> {
        const response = await this.JsonRpcRequest(PlaylistStore.Methods.PlaylistCreate, {
            name: name
        });

        if (response && response.error) {
            Exception.Throw('PlaylistStore.AddPlaylist: Playlist Create Failed.', response.error);
        }

        const mpPlaylist = response.result as MopidyPlaylist;
        const result = Playlist.CreateFromMopidy(mpPlaylist)

        return result;
    }

    public async AddPlaylistByAlbumTracks(albumTracks: AlbumTracks): Promise<Playlist> {
        const name = `${albumTracks.GetArtistName()} - ${albumTracks.Album.Name}`;
        const playlist = await this.AddPlaylist(name);

        if (!playlist) {
            Exception.Throw('PlaylistStore.AddPlaylistByAlbumTracks: Playlist Create Failed');
        }

        playlist.Tracks = albumTracks.Tracks;

        const response = await this.UpdatePlayllist(playlist);

        if (response !== true) {
            Exception.Throw('PlaylistStore.AddPlaylistByAlbumTracks: Track Update Failed.');
        }

        return playlist;
    }

    public async UpdatePlayllist(playlist: Playlist): Promise<boolean> {

        const tracks: { __model__: string; uri: string }[] = [];
        for (let i = 0; i < playlist.Tracks.length; i++) {
            const track = playlist.Tracks[i];
            tracks.push({
                __model__: 'Track',
                uri: track.Uri
            });
        }

        const response = await this.JsonRpcRequest(PlaylistStore.Methods.PlaylistSave, {
            playlist: {
                __model__: 'Playlist',
                tracks: tracks,
                uri: playlist.Uri,
                name: playlist.Name
            }
        });

        if (response && response.error) {
            Exception.Throw('PlaylistStore.UpdatePlayllist: Track Update Failed.', response.error);
        }

        return (response.result !== null);
    }

    public async DeletePlaylist(playlist: Playlist): Promise<boolean> {
        const response = await this.JsonRpcRequest(PlaylistStore.Methods.PlaylistDelete, {
            uri: playlist.Uri
        });

        if (response && response.error) {
            Exception.Throw('PlaylistStore.DeletePlaylist: Delete Failed.', response.error);
        }

        return true;
    }
}
