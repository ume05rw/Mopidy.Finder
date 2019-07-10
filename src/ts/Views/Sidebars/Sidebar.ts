import ViewBase from '../Bases/ViewBase';
import Component from 'vue-class-component';
import Libraries from '../../Libraries';

@Component({
    template: `<aside class="main-sidebar sidebar-dark-primary elevation-4">
    <div class="brand-link navbar-secondary">
        <span class="brand-text font-weight-light">Music Front</span>
    </div>
    <div class="sidebar">
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" role="tablist">
                <li class="nav-item">
                    <a  class="nav-link active"
                        href="#tab-finder"
                        role="tab"
                        data-toggle="tab"
                        aria-controls="tab-finder"
                        aria-selected="true">
                        <i class="fa fa-search nav-icon" />
                        <p>Finder</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a  class="nav-link"
                        href="#tab-playlists"
                        role="tab"
                        data-toggle="tab"
                        aria-controls="tab-playlists"
                        aria-selected="false">
                        <i class="fa fa-bookmark nav-icon" />
                        <p>Playlists</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a  class="nav-link"
                        href="#tab-settings"
                        role="tab"
                        data-toggle="tab"
                        aria-controls="tab-settings"
                        aria-selected="false">
                        <i class="fa fa-cog nav-icon" />
                        <p>Settings</p>
                    </a>
                </li>
            </ul>
        </nav>
        <div class="row mt-2">
            <div class="col-12">
                <div class="card siderbar-control">
                    <div class="card-body">
                        <img src="null" class="albumart" />
                        <h6 class="card-title">Music Title Here.</h6>
                        <span>Artist Name (year)</span>
                        <div class="player-box btn-group w-100 mt-2" role="group">
                            <button type="button" class="btn btn-secondary">
                                <i class="fa fa-fast-backward" />
                            </button>
                            <button type="button" class="btn btn-secondary">
                                <i class="fa fa-play" />
                            </button>
                            <button type="button" class="btn btn-secondary">
                                <i class="fa fa-fast-forward" />
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
                                    ref="Slider" />
                            </div>
                            <div class="col-1 volume-button volume-max">
                                <a @click="OnClickVolumeMax">
                                    <i class="fa fa-volume-up" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</aside>`,
    components: {
    }
})
export default class Sidebar extends ViewBase {

    
    private volumeSlider: JQuery;
    private volumeData: any;

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        this.volumeSlider = Libraries.$(this.$refs.Slider).ionRangeSlider({
            onChange: (data) => {
                // スライダーの値変更都度イベント
                //console.log(data);
            },
            onFinish: (data) => {
                // スライダー操作完了時のイベント
                console.log('onFinish');
            }
        });
        this.volumeData = this.volumeSlider.data('ionRangeSlider');

        return true;
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
}
