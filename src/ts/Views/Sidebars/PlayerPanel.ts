import Component from 'vue-class-component';
import Libraries from '../../Libraries';
import Player, { PlayerEvents, PlayerState } from '../../Models/Mopidies/Player';
import ViewBase from '../Bases/ViewBase';

@Component({
    template: `<div class="card siderbar-control">
    <div class="card-body">
        <img v-bind:src="player.ImageFullUri" class="albumart" />
        <h6 class="card-title">{{ player.TrackName }}</h6>
        <span>{{ player.ArtistName }}{{ (player.Year) ? '(' + player.Year + ')' : '' }}</span>
        <div class="player-box btn-group btn-group-sm w-100 mt-2" role="group">
            <button type="button"
                class="btn btn-secondary"
                @click="OnClickPrevious">
                <i class="fa fa-fast-backward" />
            </button>
            <button type="button"
                class="btn btn-secondary"
                @click="OnClickPlayPause">
                <i v-bind:class="GetPlayPauseIconClass()" ref="PlayPauseIcon"/>
            </button>
            <button type="button"
                class="btn btn-secondary"
                @click="OnClickNext">
                <i class="fa fa-fast-forward" />
            </button>
        </div>

        <div class="btn-group btn-group-sm w-100 mt-2" role="group">
            <button type="button"
                class="btn btn-secondary"
                @click="OnClickShuffle">
                <i class="fa fa fa-random"
                    ref="ShuffleIcon" />
            </button>
            <button type="button"
                class="btn btn-secondary"
                @click="OnClickRepeat">
                <i class="fa fa-retweet"
                    ref="RepeatIcon"/>
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

    private volumeSlider: JQuery;
    private volumeData: any;
    private player: Player = new Player();

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        this.volumeSlider = Libraries.$(this.$refs.Slider).ionRangeSlider({
            onFinish: (data): void => {
                // スライダー操作完了時のイベント
                this.player.SetVolume(data.from);
            }
        });
        this.volumeData = this.volumeSlider.data('ionRangeSlider');

        this.player.AddEventListener(PlayerEvents.VolumeChanged, (): void => {
            this.volumeData.update({
                from: this.player.Volume
            });
        });

        this.player.StartPolling();

        return true;
    }

    private GetPlayPauseIconClass(): string {
        return (this.player.PlayerState === PlayerState.Playing)
            ? 'fa fa-pause'
            : 'fa fa-play';
    }

    private OnClickVolumeMin(): void {
        this.volumeData.update({
            from: 0
        });
    }

    private OnClickVolumeMax(): void {
        this.volumeData.update({
            from: 100
        });
    }

    private OnClickPrevious(): void {
        this.player.Previous();
    }

    private OnClickPlayPause(): void {
        if (this.player.PlayerState === PlayerState.Playing) {
            this.player.Pause();
        } else {
            this.player.Play();
        }
    }

    private OnClickNext(): void {
        this.player.Next();
    }

    private OnClickShuffle(): void {

    }

    private OnClickRepeat(): void {

    }
}
