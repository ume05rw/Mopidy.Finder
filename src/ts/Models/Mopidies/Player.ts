import JsonRpcQueryableBase from '../Bases/JsonRpcQueryableBase';
import { default as Monitor, PlayerState } from './Monitor';
import ITlTrack from './ITlTrack';
import Delay from '../../Utils/Delay';

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
        GetTlTracks: 'core.tracklist.get_tl_tracks',
        GetPreviousTlId: 'core.tracklist.get_previous_tlid',
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

        await Delay.Wait(500);
        this.Monitor.Update();

        return true;
    }

    public async Pause(): Promise<boolean> {
        if (this._monitor.PlayerState !== PlayerState.Playing)
            return true;

        await this.JsonRpcNotice(Player.Methods.Pause);

        await Delay.Wait(500);
        this.Monitor.Update();

        return true;
    }

    public async Next(): Promise<boolean> {
        await this.JsonRpcNotice(Player.Methods.Next);

        await Delay.Wait(500);
        this.Monitor.Update();

        return true;
    }

    public async Previous(): Promise<boolean> {
        // シャッフルモードのときはカレントトラックの最初に戻る。
        //   ->こちらはそのままOKとする。
        // リピートモードのときは仕様上は前の曲に行くはずだが、やはり
        // 戻ってしまう。
        // やむなく、それぞれOnのときはリストを取得して一つ前のトラックを
        // 探すようにする。
        if (this.Monitor.IsRepeat && !this.Monitor.IsShuffle) {
            // リピートがOn、かつシャッフルがOff
            const currentTlId = this.Monitor.TlId;
            const resTlTracks = await this.JsonRpcRequest(Player.Methods.GetTlTracks);
            const tlTracks = resTlTracks.result as ITlTrack[];
            if (!tlTracks || tlTracks.length <= 0)
                return false;

            let prevTlId: number = null;
            for (let i = 0; i < tlTracks.length; i++) {
                if (tlTracks[i].tlid == currentTlId)
                    break;
                prevTlId = tlTracks[i].tlid;
            }

            if (prevTlId === null)
                return false;

            await this.JsonRpcNotice(Player.Methods.Play, {
                tlid: prevTlId
            });

            await Delay.Wait(500);
            this.Monitor.Update();

            return true;

        } else {
            // リピートがOff、もしくはシャッフルがOn
            // シャッフルOn : カレントトラックの最初から開始
            // シャッフルOff: 前のトラックを開始
            await this.JsonRpcNotice(Player.Methods.Previous);

            await Delay.Wait(500);
            this.Monitor.Update();

            return true;
        }
    }

    public async Seek(timePosition: number): Promise<boolean> {
        await this.JsonRpcNotice(Player.Methods.Seek, {
            time_position: timePosition // eslint-disable-line
        });

        await Delay.Wait(500);
        this.Monitor.Update();

        return true;
    }

    public async SetVolume(volume: number): Promise<boolean> {
        await this.JsonRpcNotice(Player.Methods.SetVolume, {
            volume: volume
        });

        return true;
    }

    public async SetShuffle(isShuffle: boolean): Promise<boolean> {
        await this.JsonRpcNotice(Player.Methods.SetRandom, {
            value: isShuffle
        });

        await Delay.Wait(500);
        this.Monitor.Update();

        return true;
    }

    public async SetRepeat(isRepeat: boolean): Promise<boolean> {
        await this.JsonRpcNotice(Player.Methods.SetRepeat, {
            value: isRepeat
        });

        await Delay.Wait(500);
        this.Monitor.Update();

        return true;
    }

    public Dispose(): void {
        this._monitor.Dispose();
        this._monitor = null;
    }

}
