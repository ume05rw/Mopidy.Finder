import Component from 'vue-class-component';
import Libraries from '../../Libraries';
import Monitor, { MonitorEvents, PlayerState } from '../../Models/Mopidies/Monitor';
import Player from '../../Models/Mopidies/Player';
import ViewBase from '../Bases/ViewBase';

@Component({
    template: `<div class="card siderbar-control pb-10">
    <div class="card-body">
        <img v-bind:src="monitor.ImageFullUri" class="albumart" />
        <h6 class="card-title">{{ monitor.TrackName }}</h6>
        <span>{{ monitor.ArtistName }}{{ (monitor.Year) ? '(' + monitor.Year + ')' : '' }}</span>
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
    private player: Player = new Player();
    private monitor: Monitor = this.player.Monitor;

    private get ButtonShuffle(): HTMLButtonElement {
        return this.$refs.ButtonShuffle as HTMLButtonElement;
    }

    private get ButtonRepeat(): HTMLButtonElement {
        return this.$refs.ButtonRepeat as HTMLButtonElement;
    }

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        this.volumeSlider = Libraries.$(this.$refs.Slider).ionRangeSlider({
            onFinish: (data): void => {
                // スライダー操作完了時のイベント
                this.player.SetVolume(data.from);
            }
        });
        this.volumeData = this.volumeSlider.data('ionRangeSlider');

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

        // ポーリング一時停止するときは、ここをコメントアウト
        //this.monitor.StartPolling();

        return true;
    }

    private GetPlayPauseIconClass(): string {
        return (this.monitor.PlayerState === PlayerState.Playing)
            ? 'fa fa-pause'
            : 'fa fa-play';
    }

    private OnClickVolumeMin(): void {
        this.volumeData.update({
            from: 0
        });
        this.player.SetVolume(0);
    }

    private OnClickVolumeMax(): void {
        this.volumeData.update({
            from: 100
        });
        this.player.SetVolume(100);
    }

    private OnClickPrevious(): void {
        this.player.Previous();
    }

    private OnClickPlayPause(): void {
        if (this.monitor.PlayerState === PlayerState.Playing) {
            this.player.Pause();
        } else {
            this.player.Play();
        }
    }

    private OnClickNext(): void {
        this.player.Next();
    }

    private OnClickShuffle(): void {
        const enabled = !this.ButtonShuffle.classList.contains(PlayerPanel.ClassDisabled);
        this.player.SetShuffle(!enabled);
    }

    private OnClickRepeat(): void {
        const enabled = !this.ButtonRepeat.classList.contains(PlayerPanel.ClassDisabled);
        this.player.SetRepeat(!enabled);
    }
}
