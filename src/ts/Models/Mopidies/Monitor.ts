import JsonRpcQueryableBase from '../Bases/JsonRpcQueryableBase';
import ITlTrack from '../Mopidies/ITlTrack';
import Exception from '../../Utils/Exception';

export const MonitorEvents = {
    TrackChanged: 'TrackChanged',
    PlayerStateChanged: 'PlayerStateChanged',
    ProgressChanged: 'ProgressChanged',
    VolumeChanged: 'VolumeChanged',
    ShuffleChanged: 'ShuffleChanged',
    RepeatChanged: 'RepeatChanged'
};

export enum PlayerState {
    Playing = 'playing',
    Stopped = 'stopped',
    Paused = 'paused'
}

export interface IStatus {
    TlId: number;
    PlayerState: PlayerState;
    IsPlaying: boolean;
    TrackName: string;
    TrackLength: number;
    TrackProgress: number;
    ArtistName: string;
    ImageUri: string;
    Year: number;
    Volume: number;
    IsShuffle: boolean;
    IsRepeat: boolean;
}

export default class Monitor extends JsonRpcQueryableBase implements IStatus {

    private static readonly PollingMsec = 2000;

    private static readonly Methods = {
        GetState: 'core.playback.get_state',
        GetCurrentTlTrack: 'core.playback.get_current_tl_track',
        GetTimePosition: 'core.playback.get_time_position',
        GetImages: 'core.library.get_images',
        GetVolume: 'core.mixer.get_volume',
        GetRandom: 'core.tracklist.get_random',
        GetRepeat: 'core.tracklist.get_repeat'
    };

    private _playerState: PlayerState = PlayerState.Paused;
    private _tlId: number = null;
    private _isPlaying: boolean = false;
    private _trackName: string = '';
    private _trackLength: number = 0;
    private _trackProgress: number = 0;
    private _artistName: string = '';
    private _year: number = null;
    private _imageUri: string = null;
    private _volume: number = 0;
    private _isShuffle: boolean = false;
    private _isRepeat: boolean;
    private _timer: number;
    private _nowOnPollingProsess: boolean = false;

    private _backupValues: IStatus = {
        TlId: null,
        PlayerState: PlayerState.Paused,
        IsPlaying: false,
        TrackName: '',
        TrackLength: 0,
        TrackProgress: 0,
        ArtistName: '',
        ImageUri: null,
        Year: 0,
        Volume: 0,
        IsShuffle: false,
        IsRepeat: false
    }


    public get TlId(): number {
        return this._tlId;
    }
    public get PlayerState(): PlayerState {
        return this._playerState;
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
    public get Volume(): number {
        return this._volume;
    }
    public get IsShuffle(): boolean {
        return this._isShuffle;
    }
    public get IsRepeat(): boolean {
        return this._isRepeat;
    }

    public get ImageFullUri(): string {
        return (!this._imageUri || this._imageUri == '')
            ? `${location.protocol}//${location.host}/img/nullImage.jpg`
            : `${location.protocol}//${location.host}${this._imageUri}`;
    }

    public StartPolling(): void {
        if (this._timer !== null)
            this.StopPolling();
            
        this._timer = setInterval((): void => {
            if (!this._nowOnPollingProsess)
                this.Polling();
        }, Monitor.PollingMsec);
    }

    public StopPolling(): void {
        try {
            clearInterval(this._timer);
        } catch (e) {
            // 握りつぶす。
        }
        
        this._timer = null;
    }

    private async Polling(): Promise<boolean> {

        this._nowOnPollingProsess = true;

        try {
            this.SetBackupValues();

            const resState = await this.JsonRpcRequest(Monitor.Methods.GetState);
            if (resState.result) {
                this._playerState = resState.result as PlayerState;
                this._isPlaying = (this._playerState === PlayerState.Playing);
            }

            const resTrack = await this.JsonRpcRequest(Monitor.Methods.GetCurrentTlTrack);
            if (resTrack.result) {
                const tlTrack = resTrack.result as ITlTrack;
                if (this._tlId !== tlTrack.tlid)
                    await this.SetTrackInfo(tlTrack);
            } else {
                this._tlId = null;
                this._trackName = '--';
                this._trackLength = 0;
                this._trackProgress = 0;
                this._artistName = '--';
                this._year = null;
                this._imageUri = null;
            }

            if (this._isPlaying) {
                const resTs = await this.JsonRpcRequest(Monitor.Methods.GetTimePosition);
                this._trackProgress = (resTs.result)
                    ? parseInt(resTs.result, 10)
                    : 0;
            } else {
                this._trackProgress = 0;
            }

            const resVol = await this.JsonRpcRequest(Monitor.Methods.GetVolume);
            this._volume = (resVol.result)
                ? resVol.result as number
                : 0;

            const resRandom = await this.JsonRpcRequest(Monitor.Methods.GetRandom);
            this._isShuffle = (resRandom.result)
                ? resRandom.result as boolean
                : false;

            const resRepeat = await this.JsonRpcRequest(Monitor.Methods.GetRepeat);
            this._isRepeat = (resRepeat.result)
                ? resRepeat.result as boolean
                : false;

            this.DetectChanges();
        } catch (ex) {
            Exception.Dump('Polling Error', ex);
        }

        this._nowOnPollingProsess = false;

        return true;
    }

    private async SetTrackInfo(tlTrack: ITlTrack): Promise<boolean> {
        const track = tlTrack.track;

        // 一旦初期化
        this._tlId = tlTrack.tlid;
        this._trackName = track.name;
        this._trackLength = 0;
        this._trackProgress = 0;
        this._artistName = '--';
        this._year = null;
        this._imageUri = null;

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
                this._imageUri = await this.GetAlbumImageUri(track.album.uri);
            }
        }

        return true;
    }

    private async GetAlbumImageUri(uri: string): Promise<string> {
        const response = await this.JsonRpcRequest(Monitor.Methods.GetImages, {
            uris: [uri]
        });

        if (!response || !response.result)
            return null;

        const results = response.result as { [uri: string]: string[] };
        const images = results[uri];

        if (!images || images.length < 0)
            return null;

        return images[0];
    }

    private SetBackupValues(): void {
        this._backupValues = {
            TlId: this.TlId,
            PlayerState: this.PlayerState,
            IsPlaying: this.IsPlaying,
            TrackName: this.TrackName,
            TrackLength: this.TrackLength,
            TrackProgress: this.TrackProgress,
            ArtistName: this.ArtistName,
            ImageUri: this.ImageUri,
            Year: this.Year,
            Volume: this.Volume,
            IsShuffle: this.IsShuffle,
            IsRepeat: this.IsRepeat
        };
    }

    private DetectChanges(): void {
        if (this._backupValues.TlId !== this.TlId)
            this.DispatchEvent(MonitorEvents.TrackChanged);
        if (this._backupValues.PlayerState !== this.PlayerState)
            this.DispatchEvent(MonitorEvents.PlayerStateChanged);
        if (this._backupValues.TrackProgress !== this.TrackProgress)
            this.DispatchEvent(MonitorEvents.ProgressChanged);
        if (this._backupValues.Volume !== this.Volume)
            this.DispatchEvent(MonitorEvents.VolumeChanged);
        if (this._backupValues.IsShuffle !== this.IsShuffle)
            this.DispatchEvent(MonitorEvents.ShuffleChanged);
        if (this._backupValues.IsRepeat !== this.IsRepeat)
            this.DispatchEvent(MonitorEvents.RepeatChanged);
    }

    public Dispose(): void {
        clearInterval(this._timer);
    }
}
