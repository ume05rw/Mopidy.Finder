import ViewBase from '../Bases/ViewBase';
import Component from 'vue-class-component';

@Component({
    template: `<aside class="main-sidebar sidebar-dark-primary elevation-4">
    <div class="brand-link navbar-secondary">
        <span class="brand-text font-weight-light">Music Front</span>
    </div>
    <div class="sidebar">
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview">
                <li class="nav-item has-treeview menu-open">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fa fa-music" />
                        <p>
                            Main
                            <i class="fa fa-angle-left right" />
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="#" class="nav-link active">
                                <i class="fa fa-search nav-icon" />
                                <p>Finder</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link">
                                <i class="fa fa-bookmark nav-icon" />
                                <p>Playlists</p>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="nav-item has-treeview">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fa fa-cog" />
                        <p>
                            Settings
                            <i class="fa fa-angle-left right" />
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="#" class="nav-link">
                                <i class="fa fa-server nav-icon" />
                                <p>Server</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="nav-link">
                                <i class="fa fa-database nav-icon" />
                                <p>Refresh</p>
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
        <div class="row mt-2">
            <div class="col-12">

<!-- admin-lteのプラグインフォルダから色々読み込む必要がある。 -->
<div class="slider-red">
    <div class="slider slider-horizontal" id="">
        <div class="slider-track">
            <div class="slider-track-low" style="left: 0px; width: 25%;"></div>
            <div class="slider-selection" style="left: 25%; width: 50%;"></div>
            <div class="slider-track-high" style="right: 0px; width: 25%;"></div>
        </div>
        <div class="tooltip tooltip-main top" role="presentation" style="left: 50%;">
            <div class="tooltip-arrow"></div>
            <div class="tooltip-inner">-100 : 100</div>
        </div>
        <div class="tooltip tooltip-min top" role="presentation" style="left: 25%; display: none;">
            <div class="tooltip-arrow"></div>
            <div class="tooltip-inner">-100</div>
        </div>
        <div class="tooltip tooltip-max top" role="presentation" style="left: 75%; display: none;">
            <div class="tooltip-arrow"></div>
            <div class="tooltip-inner">100</div>
        </div>
        <div class="slider-handle min-slider-handle round" role="slider" aria-valuemin="-200" aria-valuemax="200" aria-valuenow="-100" style="left: 25%;" tabindex="0"></div>
        <div class="slider-handle max-slider-handle round" role="slider" aria-valuemin="-200" aria-valuemax="200" aria-valuenow="100" style="left: 75%;" tabindex="0"></div>
    </div>
    <input type="text" value="-100,100" class="slider form-control" data-slider-min="-200" data-slider-max="200" data-slider-step="5"
        data-slider-value="[-100,100]" data-slider-orientation="horizontal" data-slider-selection="before" data-slider-tooltip="show" style="display: none;" data-value="-100,100">
</div>
            </div>
        </div>
    </div>
</aside>`
})
export default class Sidebar extends ViewBase {

}
