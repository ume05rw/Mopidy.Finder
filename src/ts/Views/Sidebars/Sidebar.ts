import Component from 'vue-class-component';
import ViewBase from '../Bases/ViewBase';
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
    <div class="slimScrollDiv" style="position: relative; overflow: hidden; width: auto;">
        <section class="sidebar" style="overflow: hidden; width: auto;">
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
        </section>
        <div class="slimScrollBar" />
        <div class="slimScrollRail" />
    </div>
</aside>`,
    components: {
        'player-panel': PlayerPanel
    }
})
export default class Sidebar extends ViewBase {

    private OnClickFinder(): void {
        const args: IContentChanged = {
            Name: 'Finder'
        };
        this.$emit(SidebarEvents.ContentChanged, args)
    }

    private OnClickPlaylists(): void {
        const args: IContentChanged = {
            Name: 'Playlists'
        };
        this.$emit(SidebarEvents.ContentChanged, args)
    }

    private OnClickSettings(): void {
        const args: IContentChanged = {
            Name: 'Settings'
        };
        this.$emit(SidebarEvents.ContentChanged, args)
    }
}
