import JsonRpcQueryableBase from '../Bases/JsonRpcQueryableBase';
import ITlTrack from '../Mopidies/ITlTrack';

export default class Status extends JsonRpcQueryableBase {

    private static readonly PollingIntervalMsec = 1000;
    private static readonly Methods = {
        GetState: 'core.playback.get_state',
        GetCurrentTlTrack: 'core.playback.get_current_tl_track',
        GetTimePosition: 'core.playback.get_time_position',
        GetImages: 'core.library.get_images'
    };

    private _tlId: number = null;
    private _isPlaying: boolean = false;
    private _trackName: string = '';
    private _trackLength: number = 0;
    private _trackProgress: number = 0;
    private _artistName: string = '';
    private _year: number = null;
    private _imageUri: string = null;
    private _timer: number;

    public get TlId(): number {
        return this._tlId;
    }
    public get IsPlaying(): boolean {
        return this._isPlaying;
    }
    public get TrackName(): string {
        return this._trackName;
    }
    public get TrackLength(): number {
        return this._trackLength;
    }
    public get TrackProgress(): number {
        return this._trackProgress;
    }
    public get ArtistName(): string {
        return this._artistName;
    }
    public get ImageUri(): string {
        return this._imageUri;
    }
    public get Year(): number {
        return this._year;
    }
    public get ImageFullUri(): string {
        return `${location.protocol}//${location.host}${this._imageUri}`;
    }


    public constructor() {
        super();
    }

    public StartPolling(): void {
        this._timer = setInterval(() => {
            this.Polling();
        }, Status.PollingIntervalMsec);
    }

    private async Polling(): Promise<boolean> {
        const resState = await this.JsonRpcRequest(Status.Methods.GetState);
        if (resState.result)
            this._isPlaying = (resState.result == 'playing');

        const resTrack = await this.JsonRpcRequest(Status.Methods.GetCurrentTlTrack);
        if (resTrack.result) {
            const tlTrack = resTrack.result as ITlTrack;
            const track = tlTrack.track;
            if (this._trackName != track.name) {

                // 一旦初期化
                this._tlId = null;
                this._trackName = '--';
                this._trackLength = 0;
                this._trackProgress = 0;
                this._artistName = '--';
                this._year = null;
                this._imageUri = null;

                this._trackName = track.name;
                this._tlId = tlTrack.tlid;

                if (track.artists && 0 < track.artists.length) {
                    this._artistName = (track.artists.length === 1)
                        ? track.artists[0].name
                        : track.artists[0].name + ' and more...';
                } else {
                    this._artistName = '';
                }

                if (track.date && 4 <= track.date.length) {
                    this._year = (4 < track.date.length)
                        ? parseInt(track.date.substring(0, 4), 10)
                        : parseInt(track.date, 10);
                }

                this._trackLength = (track.length)
                    ? track.length
                    : 0;

                if (track.album) {
                    if (track.album.images && 0 < track.album.images.length) {
                        this._imageUri = track.album.images[0];
                    } else if (track.album.uri) {
                        const resImages = await this.JsonRpcRequest(Status.Methods.GetImages, {
                            uris: [track.album.uri]
                        });
                        if (resImages.result) {
                            const images = resImages.result[track.album.uri];
                            if (images && 0 < images.length) {
                                this._imageUri = images[0];
                            }
                        }
                    }
                }
            }
        } else {
            this._tlId = null;
            this._trackName = '--';
            this._trackLength = 0;
            this._trackProgress = 0;
            this._artistName = '--';
            this._year = null;
            this._imageUri = null;
        }

        const resTs = await this.JsonRpcRequest(Status.Methods.GetTimePosition);
        this._trackProgress = (resTs.result)
            ? parseInt(resTs.result, 10)
            : 0;

        console.log(this);

        return true;
    }

    public Dispose(): void {
        clearInterval(this._timer);
    }

}
