import Libraries from '../../Libraries';
import JsonRpcQueryableBase from '../Bases/JsonRpcQueryableBase';
import IPlaylist from '../Mopidies/IPlaylist';
import IRef from '../Mopidies/IRef';
import ITrack from '../Mopidies/ITrack';
import Playlist from './Playlist';

export default class PlaylistStore extends JsonRpcQueryableBase {

    private static readonly Methods = {
        AsList: 'core.playlists.as_list',
        PlaylistLookup: 'core.playlists.lookup',
        LibraryLookup: 'core.library.lookup',
        GetImages: 'core.library.get_images',
    }

    public async GetPlaylists(): Promise<Playlist[]> {
        const response = await this.JsonRpcRequest(PlaylistStore.Methods.AsList);

        const refs = response.result as IRef[];
        const ordered = Libraries.Enumerable.from(refs)
            .orderBy(e => e.name)
            .toArray();
        const result = Playlist.CreateArrayByRefs(ordered);

        return result;
    }

    public async GetTracksByPlaylist(playlist: Playlist): Promise<ITrack[]> {
        const response = await this.JsonRpcRequest(PlaylistStore.Methods.PlaylistLookup, {
            uri: playlist.Uri
        });

        const mpPlaylist = response.result as IPlaylist;
        const trackUris = Libraries.Enumerable.from(mpPlaylist.tracks)
            .select(e => e.uri)
            .toArray();

        const response2 = await this.JsonRpcRequest(PlaylistStore.Methods.LibraryLookup, {
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
        const resImages = await this.JsonRpcRequest(PlaylistStore.Methods.GetImages, {
            uris: [uri]
        });

        if (resImages.result) {
            const images = resImages.result[uri];
            if (images && 0 < images.length)
                return images[0];
        }

        return null;
    }

    private async ClearList(): Promise<boolean> {
        const response = await this.QueryPost('Player/ClearList');

        if (!response.Succeeded) {
            console.error(response.Errors);
            throw new Error('Unexpected Error on ApiQuery');
        }

        return response.Result as boolean;
    }
}
