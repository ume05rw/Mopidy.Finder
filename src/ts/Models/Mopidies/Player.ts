import JsonRpcQueryableBase from '../Bases/JsonRpcQueryableBase';
import ITlTrack from '../Mopidies/ITlTrack';
import { default as Monitor, PlayerState } from './Monitor';

export default class Player extends JsonRpcQueryableBase {

    private _monitor: Monitor;

    public get Monitor(): Monitor {
        return this._monitor;
    }

    public constructor() {
        super();

        this._monitor = new Monitor();
    }

    private static readonly Methods = {
        Play: 'core.playback.play',
        Resume: 'core.playback.resume',
        Pause: 'core.playback.pause',
        Stop: 'core.playback.stop',
        Next: 'core.playback.next',
        Previous: 'core.playback.previous',
        Seek: 'core.playback.seek',
        SetVolume: 'core.mixer.set_volume',
        SetRandom: 'core.tracklist.set_random',
        SetRepeat: 'core.tracklist.set_repeat'
    };

    public async Play(): Promise<boolean> {
        if (this._monitor.PlayerState === PlayerState.Playing)
            return true;

        if (!this._monitor.TlId)
            return false;

        if (this._monitor.PlayerState === PlayerState.Paused) {
            await this.JsonRpcNotice(Player.Methods.Resume);
        } else if (this._monitor.PlayerState === PlayerState.Stopped) {
            await this.JsonRpcNotice(Player.Methods.Play, {
                tlid: this._monitor.TlId
            });
        }

        return true;
    }

    public async Pause(): Promise<boolean> {
        if (this._monitor.PlayerState !== PlayerState.Playing)
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
            = await this.JsonRpcNotice(Player.Methods.SetVolume, {
                volume: volume
            });

        return true;
    }

    public async SetShuffle(isShuffle: boolean): Promise<boolean> {
        const response = await this.JsonRpcNotice(Player.Methods.SetRandom, {
            value: isShuffle
        });

        return true;
    }

    public async SetRepeat(isRepeat: boolean): Promise<boolean> {
        const response = await this.JsonRpcNotice(Player.Methods.SetRepeat, {
            value: isRepeat
        });

        return true;
    }

    public Dispose(): void {
        this._monitor.Dispose();
        this._monitor = null;
    }

}
