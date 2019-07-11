import ViewBase from '../Bases/ViewBase';
import Component from 'vue-class-component';
import Libraries from '../../Libraries';
import * as _ from 'lodash';
import PlayerPanel from './PlayerPanel';

export interface IContentChanged {
    Name: string;
}

export const SidebarEvents = {
    ContentChanged: 'ContentChanged'
}

@Component({
    template: `<aside class="main-sidebar sidebar-dark-primary elevation-4">
    <div class="brand-link navbar-secondary">
        <span class="brand-text font-weight-light">Mopidy Finder</span>
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
                        aria-selected="true"
                        @click="OnClickFinder" >
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
                        aria-selected="false"
                        @click="OnClickPlaylists" >
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
                        aria-selected="false"
                        @click="OnClickSettings" >
                        <i class="fa fa-cog nav-icon" />
                        <p>Settings</p>
                    </a>
                </li>
            </ul>
        </nav>
        <div class="row mt-2">
            <div class="col-12">
                <player-panel ref="PlayerPanel" />
            </div>
        </div>
    </div>
</aside>`,
    components: {
        'player-panel': PlayerPanel
    }
})
export default class Sidebar extends ViewBase {

    private OnClickFinder(): void {
        this.$emit(SidebarEvents.ContentChanged, {
            Name: 'Finder'
        } as IContentChanged)
    }

    private OnClickPlaylists(): void {
        this.$emit(SidebarEvents.ContentChanged, {
            Name: 'Playlists'
        } as IContentChanged)
    }

    private OnClickSettings(): void {
        this.$emit(SidebarEvents.ContentChanged, {
            Name: 'Settings'
        } as IContentChanged)
    }
   
}
