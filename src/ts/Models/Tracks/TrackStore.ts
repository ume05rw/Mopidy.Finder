import Libraries from '../../Libraries';
import Exception from '../../Utils/Exception';
import JsonRpcQueryableBase from '../Bases/JsonRpcQueryableBase';
import MopidyTrack from '../Mopidies/ITrack';
import Track from '../Tracks/Track';

export default class TrackStore extends JsonRpcQueryableBase {

    private static readonly Methods = {
        LibraryLookup: 'core.library.lookup',
    }

    public async EnsureTracks(tracks: Track[]): Promise<boolean> {

        const trackUris = Libraries.Enumerable.from(tracks)
            .where((e): boolean => (
                !e.Name
                || !e.Length
            ))
            .select((e): string => e.Uri)
            .toArray();

        const response
            = await this.JsonRpcRequest(TrackStore.Methods.LibraryLookup, {
                uris: trackUris
            });

        const pairList = response.result as { [uri: string]: MopidyTrack[] };

        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            const uri = track.Uri;
            const pairedTrackArray = pairList[uri];

            if (track.Name && track.Length)
                continue;

            if (
                (!track.Name || !track.Length)
                && (!pairedTrackArray || pairedTrackArray.length <= 0)
            ) {
                Exception.Dump(
                    'TrackStore.EnsureTracks: Track Details Not Found',
                    { track, pairedTrackArray }
                );
                continue;
            }

            const mpTrack = pairList[uri][0];
            Track.EnsureTrackByMopidy(track, mpTrack);
        }

        return true;
    }
}
