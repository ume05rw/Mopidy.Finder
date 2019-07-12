import JsonRpcQueryableBase from '../Bases/JsonRpcQueryableBase';
import ITlTrack from '../Mopidies/ITlTrack';

export const PlayerEvents = {
    TrackChanged: 'TrackChanged',
    PlayerStateChanged: 'PlayerStateChanged',
    ProgressChanged: 'ProgressChanged',
    VolumeChanged: 'VolumeChanged'
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
}

export default class Player extends JsonRpcQueryableBase implements IStatus {

    private static readonly PollingMsec = 2000;

    private static readonly Methods = {
        GetState: 'core.playback.get_state',
        GetCurrentTlTrack: 'core.playback.get_current_tl_track',
        GetTimePosition: 'core.playback.get_time_position',
        GetImages: 'core.library.get_images',

        Play: 'core.playback.play',
        Resume: 'core.playback.resume',
        Pause: 'core.playback.pause',
        Stop: 'core.playback.stop',
        Next: 'core.playback.next',
        Previous: 'core.playback.previous',
        Seek: 'core.playback.seek',

        GetRandom: 'core.tracklist.get_random',
        SetRandom: 'core.tracklist.set_random',

        GetVolume: 'core.mixer.get_volume',
        SetVolume: 'core.mixer.set_volume'
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
    private _timer: number;

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
        Volume: 0
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

    public get ImageFullUri(): string {
        return `${location.protocol}//${location.host}${this._imageUri}`;
    }


    public StartPolling(): void {
        this._timer = setInterval((): void => {
            this.Polling();
        }, Player.PollingMsec);
    }

    private async Polling(): Promise<boolean> {

        this.SetBackupValues();

        const resState = await this.JsonRpcRequest(Player.Methods.GetState);
        if (resState.result) {
            this._playerState = resState.result as PlayerState;
            this._isPlaying = (this._playerState === PlayerState.Playing);
        }

        const resTrack = await this.JsonRpcRequest(Player.Methods.GetCurrentTlTrack);
        if (resTrack.result) {
            const tlTrack = resTrack.result as ITlTrack;
            const track = tlTrack.track;
            if (this._tlId !== tlTrack.tlid) {

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

        const resTs = await this.JsonRpcRequest(Player.Methods.GetTimePosition);
        this._trackProgress = (resTs.result)
            ? parseInt(resTs.result, 10)
            : 0;

        const resVol = await this.JsonRpcRequest(Player.Methods.GetVolume);
        if (resVol.result)
            this._volume = resVol.result as number;

        this.DetectChanges();

        return true;
    }

    private async GetAlbumImageUri(uri: string): Promise<string> {
        const response = await this.JsonRpcRequest(Player.Methods.GetImages, {
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
            Volume: this.Volume
        };
    }

    private DetectChanges(): void {
        if (this._backupValues.TlId !== this.TlId)
            this.DispatchEvent(PlayerEvents.TrackChanged);
        if (this._backupValues.PlayerState !== this.PlayerState)
            this.DispatchEvent(PlayerEvents.PlayerStateChanged);
        if (this._backupValues.TrackProgress !== this.TrackProgress)
            this.DispatchEvent(PlayerEvents.ProgressChanged);
        if (this._backupValues.Volume !== this.Volume)
            this.DispatchEvent(PlayerEvents.VolumeChanged);
    }

    public async Play(): Promise<boolean> {
        if (this._playerState === PlayerState.Playing)
            return true;

        if (!this._tlId)
            return false;

        if (this._playerState === PlayerState.Paused) {
            await this.JsonRpcNotice(Player.Methods.Resume);
        } else if (this._playerState === PlayerState.Stopped) {
            await this.JsonRpcNotice(Player.Methods.Play, {
                tlid: this._tlId
            });
        }

        return true;
    }

    public async Pause(): Promise<boolean> {
        if (this._playerState !== PlayerState.Playing)
            return true;

        await this.JsonRpcNotice(Player.Methods.Pause);

        return true;
    }

    public async Next(): Promise<boolean> {
        await this.JsonRpcNotice(Player.Methods.Next);

        return true;
    }

    public async Previous(): Promise<boolean> {
        await this.JsonRpcNotice(Player.Methods.Previous);

        return true;
    }

    public async Seek(timePosition: number): Promise<boolean> {
        await this.JsonRpcNotice(Player.Methods.Seek, {
            time_position: timePosition // eslint-disable-line
        });

        return true;
    }

    public async SetVolume(volume: number): Promise<boolean> {
        const resSucceeded
            = await this.JsonRpcRequest(Player.Methods.SetVolume, {
                volume: volume
            });

        return resSucceeded.result as boolean;
    }

    public Dispose(): void {
        clearInterval(this._timer);
    }

}
