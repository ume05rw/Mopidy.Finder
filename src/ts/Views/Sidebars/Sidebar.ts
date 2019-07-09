import ViewBase from '../Bases/ViewBase';
import Component from 'vue-class-component';
import VueSlider from 'vue-slider-component';
import Libraries from '../../Libraries';

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
                <vue-slider v-model="volume"></vue-slider>
            </div>
        </div>
    </div>
</aside>`,
    components: {
        'vue-slider': VueSlider
    }
})
export default class Sidebar extends ViewBase {

    private volume: number;

}
