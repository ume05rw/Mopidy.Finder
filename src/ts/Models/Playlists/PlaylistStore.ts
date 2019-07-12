import Libraries from '../../Libraries';
import JsonRpcQueryableBase from '../Bases/JsonRpcQueryableBase';
import IPlaylist from '../Mopidies/IPlaylist';
import IRef from '../Mopidies/IRef';
import ITrack from '../Mopidies/ITrack';
import Playlist from './Playlist';
import Track from '../Tracks/Track';
import ITlTrack from '../Mopidies/ITlTrack';

export default class PlaylistStore extends JsonRpcQueryableBase {

    private static readonly Methods = {
        PlaylistAsList: 'core.playlists.as_list',
        PlaylistLookup: 'core.playlists.lookup',
        LibraryLookup: 'core.library.lookup',
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
        const result = Playlist.CreateArrayByRefs(ordered);

        return result;
    }

    public async GetTracksByPlaylist(playlist: Playlist): Promise<ITrack[]> {
        const response
            = await this.JsonRpcRequest(PlaylistStore.Methods.PlaylistLookup, {
                uri: playlist.Uri
            });

        const mpPlaylist = response.result as IPlaylist;
        const trackUris = Libraries.Enumerable.from(mpPlaylist.tracks)
            .select((e): string => e.uri)
            .toArray();

        const response2
            = await this.JsonRpcRequest(PlaylistStore.Methods.LibraryLookup, {
                uris: trackUris
            });

        const pairList = response2.result as { [uri: string]: ITrack[] };

        // プレイリストの順序通りにトラックを並べて取得する。
        const tracks: ITrack[] = [];
        for (let i = 0; i < mpPlaylist.tracks.length; i++) {
            const track = mpPlaylist.tracks[i];

            if (!pairList[track.uri])
                continue;

            const completedTrack = pairList[track.uri][0];
            if (completedTrack)
                tracks.push(completedTrack);
        }

        return tracks;
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
            throw new Error(resAdd.error);

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
            throw new Error(`track: ${track.Name} not assigned TlId`);

        await this.PlayByTlId(track.TlId);

        return true;
    }

    public async PlayByTlId(tlId: number): Promise<boolean> {

        await this.JsonRpcNotice(PlaylistStore.Methods.PlaybackPlay, {
            tlid: tlId
        });

        return true;
    }
}
