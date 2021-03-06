import Component from 'vue-class-component';
import Libraries from '../../Libraries';
import Monitor, { MonitorEvents, PlayerState } from '../../Models/Mopidies/Monitor';
import Player from '../../Models/Mopidies/Player';
import ViewBase from '../Bases/ViewBase';

export const PlayerPanelEvents = {
    Operated: 'Operated'
};

@Component({
    template: `<div class="card siderbar-control pb-10">
    <div class="card-body">
        <img v-bind:src="imageFullUri" class="albumart" />
        <h6 class="card-title">{{ trackName }}</h6>
        <span>{{ trackDetail }}</span>
        <div class="player-box btn-group btn-group-sm w-100 mt-2" role="group">
            <button type="button"
                class="btn btn-warning"
                @click="OnClickPrevious">
                <i class="fa fa-fast-backward" />
            </button>
            <button type="button"
                class="btn btn-warning"
                @click="OnClickPlayPause">
                <i v-bind:class="GetPlayPauseIconClass()" ref="PlayPauseIcon"/>
            </button>
            <button type="button"
                class="btn btn-warning"
                @click="OnClickNext">
                <i class="fa fa-fast-forward" />
            </button>
        </div>

        <div class="btn-group btn-group-sm w-100 mt-2" role="group">
            <button type="button"
                class="btn btn-warning disabled"
                ref="ButtonShuffle"
                @click="OnClickShuffle">
                <i class="fa fa fa-random" />
            </button>
            <button type="button"
                class="btn btn-warning disabled"
                ref="ButtonRepeat"
                @click="OnClickRepeat" >
                <i class="fa fa-retweet" />
            </button>
        </div>

        <div class="row volume-box w-100 mt-2">
            <div class="col-1 volume-button volume-min">
                <a @click="OnClickVolumeMin">
                    <i class="fa fa-volume-off" />
                </a>
            </div>
            <div class="col-10">
                <input type="text"
                    data-type="single"
                    data-min="0"
                    data-max="100"
                    data-from="100"
                    data-grid="true"
                    data-hide-min-max="true"
                    ref="Slider" />
            </div>
            <div class="col-1 volume-button volume-max">
                <a @click="OnClickVolumeMax">
                    <i class="fa fa-volume-up" />
                </a>
            </div>
        </div>
    </div>
</div>`})
export default class PlayerPanel extends ViewBase {

    private static readonly ClassDisabled: string = 'disabled';

    private volumeSlider: JQuery;
    private volumeData: any;
    private player: Player = Player.Instance;
    private monitor: Monitor = this.player.Monitor;
    private imageFullUri: string = this.monitor.ImageFullUri;
    private trackName: string = '--';
    private trackDetail: string = '--';

    private get ButtonShuffle(): HTMLButtonElement {
        return this.$refs.ButtonShuffle as HTMLButtonElement;
    }

    private get ButtonRepeat(): HTMLButtonElement {
        return this.$refs.ButtonRepeat as HTMLButtonElement;
    }

    public async Initialize(): Promise<boolean> {
        super.Initialize();

        this.volumeSlider = Libraries.$(this.$refs.Slider).ionRangeSlider({
            onFinish: (data): void => {
                // スライダー操作完了時のイベント
                this.player.SetVolume(data.from);
            }
        });
        this.volumeData = this.volumeSlider.data('ionRangeSlider');

        this.monitor.AddEventListener(MonitorEvents.TrackChanged, (): void => {
            this.imageFullUri = this.monitor.ImageFullUri;
            this.trackName = this.monitor.TrackName;
            this.trackDetail = (this.monitor.ArtistName) + ((this.monitor.Year)
                ? '(' + this.monitor.Year + ')'
                : '');
        });

        this.monitor.AddEventListener(MonitorEvents.VolumeChanged, (): void => {
            this.volumeData.update({
                from: this.monitor.Volume
            });
        });

        this.monitor.AddEventListener(MonitorEvents.ShuffleChanged, (): void => {
            const enabled = !this.ButtonShuffle.classList.contains(PlayerPanel.ClassDisabled);

            if (this.monitor.IsShuffle && !enabled)
                this.ButtonShuffle.classList.remove(PlayerPanel.ClassDisabled);
            else if (!this.monitor.IsShuffle && enabled)
                this.ButtonShuffle.classList.add(PlayerPanel.ClassDisabled);
        });

        this.monitor.AddEventListener(MonitorEvents.RepeatChanged, (): void => {
            const enabled = !this.ButtonRepeat.classList.contains(PlayerPanel.ClassDisabled);

            if (this.monitor.IsRepeat && !enabled)
                this.ButtonRepeat.classList.remove(PlayerPanel.ClassDisabled);
            else if (!this.monitor.IsRepeat && enabled)
                this.ButtonRepeat.classList.add(PlayerPanel.ClassDisabled);
        });

        return true;
    }

    public StartMonitor(): void {
        // ポーリング一時停止するときは、ここをコメントアウト
        this.monitor.StartPolling();
    }

    public StopMonitor(): void {
        this.monitor.StopPolling();
    }

    private GetPlayPauseIconClass(): string {
        return (this.monitor.PlayerState === PlayerState.Playing)
            ? 'fa fa-pause'
            : 'fa fa-play';
    }

    private async OnClickVolumeMin(): Promise<boolean> {
        this.volumeData.update({
            from: 0
        });
        this.$emit(PlayerPanelEvents.Operated);
        await this.player.SetVolume(0);

        return true;
    }

    private async OnClickVolumeMax(): Promise<boolean> {
        this.volumeData.update({
            from: 100
        });
        this.$emit(PlayerPanelEvents.Operated);
        await this.player.SetVolume(100);

        return true;
    }

    private async OnClickPrevious(): Promise<boolean> {
        this.$emit(PlayerPanelEvents.Operated);
        await this.player.Previous();
        this.RemoveFocus();

        return true;
    }

    private async OnClickPlayPause(): Promise<boolean> {
        this.$emit(PlayerPanelEvents.Operated);
        (this.monitor.PlayerState === PlayerState.Playing)
            ? await this.player.Pause()
            : await this.player.Play();
        this.RemoveFocus();

        return true;
    }

    private async OnClickNext(): Promise<boolean> {
        this.$emit(PlayerPanelEvents.Operated);
        await this.player.Next();
        this.RemoveFocus();

        return true;
    }

    private async OnClickShuffle(): Promise<boolean> {
        this.$emit(PlayerPanelEvents.Operated);
        const enabled = !this.ButtonShuffle.classList.contains(PlayerPanel.ClassDisabled);
        await this.player.SetShuffle(!enabled);
        this.RemoveFocus();

        return true;
    }

    private async OnClickRepeat(): Promise<boolean> {
        this.$emit(PlayerPanelEvents.Operated);
        const enabled = !this.ButtonRepeat.classList.contains(PlayerPanel.ClassDisabled);
        await this.player.SetRepeat(!enabled);
        this.RemoveFocus();

        return true;
    }

    private RemoveFocus(): void {
        if (document.activeElement) {
            try {
                (document.activeElement as HTMLElement).blur();
            } catch (ex) {
                // 握りつぶす。
            }
        }
    }
}
