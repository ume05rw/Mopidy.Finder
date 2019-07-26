import Libraries from '../../Libraries';
import Delay from '../../Utils/Delay';
import Exception from '../../Utils/Exception';
import AlbumTracks from '../AlbumTracks/AlbumTracks';
import { default as JsonRpcQueryableBase } from '../Bases/JsonRpcQueryableBase';
import Playlist from '../Playlists/Playlist';
import Track from '../Tracks/Track';
import ITlTrack from './ITlTrack';
import { default as Monitor, PlayerState } from './Monitor';

export default class Player extends JsonRpcQueryableBase {

    private static _instance: Player = null;
    public static get Instance(): Player {
        if (!Player._instance)
            Player._instance = new Player();

        return Player._instance;
    }

    private _monitor: Monitor;

    public get Monitor(): Monitor {
        return this._monitor;
    }

    private constructor() {
        super();

        this._monitor = Monitor.Instance;
    }

    private static readonly Methods = {
        Play: 'core.playback.play',
        Resume: 'core.playback.resume',
        Pause: 'core.playback.pause',
        Stop: 'core.playback.stop',
        Next: 'core.playback.next',
        Previous: 'core.playback.previous',
        GetTlTracks: 'core.tracklist.get_tl_tracks',
        //GetPreviousTlId: 'core.tracklist.get_previous_tlid',
        Seek: 'core.playback.seek',
        SetVolume: 'core.mixer.set_volume',
        SetRandom: 'core.tracklist.set_random',
        SetRepeat: 'core.tracklist.set_repeat',
        ClearList: 'core.tracklist.clear',
        AddToList: 'core.tracklist.add'
    };

    public async Play(): Promise<boolean> {
        if (this._monitor.PlayerState === PlayerState.Playing)
            return true;

        if (!this._monitor.TlId)
            return false;

        if (this._monitor.PlayerState === PlayerState.Paused) {
            const response = await this.JsonRpcNotice(Player.Methods.Resume);
            if (response !== true)
                return false;
        } else if (this._monitor.PlayerState === PlayerState.Stopped) {
            const response = await this.PlayByTlId(this.Monitor.TlId);
            if (response !== true)
                return false;
        }

        Delay.Wait(500)
            .then((): void => {
                this.Monitor.Update();
            });

        return true;
    }

    public async PlayByTlId(tlId: number): Promise<boolean> {
        const response = await this.JsonRpcNotice(Player.Methods.Play, {
            tlid: tlId
        });
        if (response !== true)
            return false;

        Delay.Wait(500)
            .then((): void => {
                this.Monitor.Update();
            });

        return true;
    }

    public async PlayByAlbumTracks(albumTracks: AlbumTracks, track: Track): Promise<boolean> {
        if (!albumTracks.Tracks || albumTracks.Tracks.length <= 0)
            Exception.Throw('Player.PlayByAlbumTracks: Track Not Found.', albumTracks);

        const resClear = await this.ClearTracklist();
        if (resClear !== true)
            return false;

        const resAdd = await this.AddTracks(albumTracks.Tracks);
        if (resAdd !== true)
            return false;

        if (track.TlId === null || track.TlId === undefined)
            return false;

        const resPlay = await this.PlayByTlId(track.TlId);
        if (resPlay !== true)
            return false;

        Delay.Wait(500)
            .then((): void => {
                this.Monitor.Update();
            });

        return true;
    }

    public async PlayByPlaylist(playlist: Playlist, track: Track): Promise<boolean> {
        if (!playlist.Tracks || playlist.Tracks.length <= 0)
            Exception.Throw('Player.PlayByPlaylist: Track Not Found.', playlist);

        const resClear = await this.ClearTracklist();
        if (resClear !== true)
            return false;

        const resAdd = await this.AddTracks(playlist.Tracks);
        if (resAdd !== true)
            return false;

        if (track.TlId === null || track.TlId === undefined)
            return false;

        const resPlay = await this.PlayByTlId(track.TlId);
        if (resPlay !== true)
            return false;

        Delay.Wait(500)
            .then((): void => {
                this.Monitor.Update();
            });

        return true;
    }

    private async AddTracks(tracks: Track[]): Promise<boolean> {
        const enTracks = Libraries.Enumerable.from(tracks);
        const uris = enTracks
            .select((e): string => e.Uri)
            .toArray();

        const respAdd = await this.JsonRpcRequest(Player.Methods.AddToList, {
            uris: uris
        });
        if (respAdd.error)
            return false;

        const tlTracks = respAdd.result as ITlTrack[];
        for (let i = 0; i < tlTracks.length; i++) {
            const tlTrack = tlTracks[i];
            const updateTrack = enTracks
                .firstOrDefault((e): boolean => e.Uri === tlTrack.track.uri);
            if (!updateTrack)
                continue;
            updateTrack.TlId = tlTrack.tlid;
        }

        return true;
    }

    public async ClearTracklist(): Promise<boolean> {
        const response = await this.JsonRpcNotice(Player.Methods.ClearList);

        return (response === true);
    }

    public async Pause(): Promise<boolean> {
        if (this._monitor.PlayerState !== PlayerState.Playing)
            return true;

        const response = await this.JsonRpcNotice(Player.Methods.Pause);
        if (response !== true)
            return false;

        Delay.Wait(500)
            .then((): void => {
                this.Monitor.Update();
            });

        return true;
    }

    public async Next(): Promise<boolean> {
        const response = await this.JsonRpcNotice(Player.Methods.Next);
        if (response !== true)
            return false;

        Delay.Wait(500)
            .then((): void => {
                this.Monitor.Update();
            });

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
            if (!resTlTracks || resTlTracks.error)
                return false;

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

            const resPlay = await this.JsonRpcNotice(Player.Methods.Play, {
                tlid: prevTlId
            });
            if (resPlay !== true)
                return false;
        } else {
            // リピートがOff、もしくはシャッフルがOn
            // シャッフルOn : カレントトラックの最初から開始
            // シャッフルOff: 前のトラックを開始
            const response = await this.JsonRpcNotice(Player.Methods.Previous);
            if (response !== true)
                return false;
        }

        Delay.Wait(500)
            .then((): void => {
                this.Monitor.Update();
            });

        return true;
    }

    public async Seek(timePosition: number): Promise<boolean> {
        const response = await this.JsonRpcNotice(Player.Methods.Seek, {
            time_position: timePosition // eslint-disable-line
        });
        if (response !== true)
            return false;

        Delay.Wait(500)
            .then((): void => {
                this.Monitor.Update();
            });

        return true;
    }

    public async SetVolume(volume: number): Promise<boolean> {
        const response = await this.JsonRpcNotice(Player.Methods.SetVolume, {
            volume: volume
        });
        if (response !== true)
            return false;

        Delay.Wait(500)
            .then((): void => {
                this.Monitor.Update();
            });

        return true;
    }

    public async SetShuffle(isShuffle: boolean): Promise<boolean> {
        const response = await this.JsonRpcNotice(Player.Methods.SetRandom, {
            value: isShuffle
        });
        if (response !== true)
            return false;

        Delay.Wait(500)
            .then((): void => {
                this.Monitor.Update();
            });

        return true;
    }

    public async SetRepeat(isRepeat: boolean): Promise<boolean> {
        const response = await this.JsonRpcNotice(Player.Methods.SetRepeat, {
            value: isRepeat
        });
        if (response !== true)
            return false;

        Delay.Wait(500)
            .then((): void => {
                this.Monitor.Update();
            });

        return true;
    }

    public Dispose(): void {
        this._monitor.Dispose();
        this._monitor = null;
    }

}
