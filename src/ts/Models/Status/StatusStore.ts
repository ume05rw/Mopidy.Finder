import JsonRpcQueryableBase from '../Bases/JsonRpcQueryableBase';
import Status from './Status';

export default class StatusStore extends JsonRpcQueryableBase {

    private _status: Status = new Status();
    private _timer: number;
    private _methods = {
        GetState: 'core.playback.get_state',
        GetCurrentTlTrack: 'core.playback.get_current_tl_track',
        GetTimePosition: 'core.playback.get_time_position',
        GetImages: 'core.library.get_images'
    };

    public constructor() {
        super();

        this.Polling();
    }

    private Polling(): void {
        this._timer = setInterval(() => {
            this.GetStatus();
        }, 1000);
    }

    private async GetStatus(): Promise<boolean> {
        const resState = await this.JsonRpcRequest(this._methods.GetState);
        if (resState.result)
            this._status.IsPlaying = (resState.result == 'playing');

        const resTrack = await this.JsonRpcRequest(this._methods.GetCurrentTlTrack);
        if (resTrack.result) {
            var track = resTrack.result.track;
            if (this._status.TrackName != track.name) {
                this._status.TrackName = track.name;

                if (track.artists && 0 < track.artists.length) {
                    this._status.ArtistName = (track.artists.length === 1)
                        ? track.artists[0].name
                        : track.artists[0].name + ' and more...';
                } else {
                    this._status.ArtistName = '';
                }

                if (track.date && 4 <= track.date.length) {
                    this._status.Year = (4 < track.date.length)
                        ? parseInt(track.date.substring(0, 4), 10)
                        : parseInt(track.date, 10);
                }

                this._status.TrackLength = (track.length)
                    ? parseInt(track.length, 10)
                    : 0;

                if (track.album) {
                    if (track.album.images && 0 < track.album.images.length) {
                        this._status.AlbumImageUri = track.album.images[0];
                    } else if (track.album.uri) {
                        const resImages = await this.JsonRpcRequest(this._methods.GetImages, {
                            uris: [ track.album.uri ]
                        });
                        if (resImages.result) {
                            const images = resImages.result[track.album.uri];
                            if (images && 0 < images.length) {
                                this._status.AlbumImageUri = images[0];
                            }
                        }
                    }
                }
            }
        } else {
            this._status.TrackName = '--';
            this._status.ArtistName = '--';
            this._status.Year = null;
            this._status.TrackLength = 0;
            this._status.AlbumImageUri = null;
        }

        const resTs = await this.JsonRpcRequest(this._methods.GetTimePosition);
        this._status.TrackProgress = (resTs.result)
            ? parseInt(resTs.result, 10)
            : 0;

        console.log(this._status);

        return true;
    }

    public Dispose(): void {
        clearTimeout(this._timer);
    }
}
