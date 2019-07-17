import Component from 'vue-class-component';
import ViewBase from '../Bases/ViewBase';
import PlayerPanel from './PlayerPanel';
import Libraries from '../../Libraries';

export enum Pages {
    Finder = 'Finder',
    Playlists = 'Playlists',
    Settings = 'Settings'
}

export interface IContentChanged {
    Page: Pages;
}
export interface IContentOrdered extends IContentChanged {
    Permitted: boolean;
}

export const SidebarEvents = {
    ContentOrdered: 'ContentOrdered',
    ContentChanged: 'ContentChanged',
}

@Component({
    template: `<aside class="main-sidebar sidebar-dark-primary elevation-4">
    <div class="brand-link navbar-secondary">
        <span class="brand-text font-weight-light">Mopidy.Finder</span>
    </div>
    <section
        class="sidebar"
        ref="SidebarSection">
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
</aside>`,
    components: {
        'player-panel': PlayerPanel
    }
})
export default class Sidebar extends ViewBase {

    private get SidebarSection(): HTMLTableSectionElement {
        return this.$refs.SidebarSection as HTMLTableSectionElement;
    }

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        Libraries.SlimScroll(this.SidebarSection, {
            height: '100vh'
        });

        return true;
    }

    private OnClickFinder(ev: MouseEvent): void {
        const orderedArgs: IContentOrdered = {
            Page: Pages.Finder,
            Permitted: true
        };
        this.$emit(SidebarEvents.ContentOrdered, orderedArgs);

        if (!orderedArgs.Permitted) {
            ev.preventDefault();
            ev.stopPropagation();
        }

        const changedArgs: IContentChanged = {
            Page: Pages.Finder
        };
        this.$emit(SidebarEvents.ContentChanged, changedArgs)
    }

    private OnClickPlaylists(ev: MouseEvent): void {
        const orderedArgs: IContentOrdered = {
            Page: Pages.Playlists,
            Permitted: true
        };
        this.$emit(SidebarEvents.ContentOrdered, orderedArgs);

        if (!orderedArgs.Permitted) {
            ev.preventDefault();
            ev.stopPropagation();
        }

        const changedArgs: IContentChanged = {
            Page: Pages.Playlists
        };
        this.$emit(SidebarEvents.ContentChanged, changedArgs)
    }

    private OnClickSettings(ev: MouseEvent): void {
        const orderedArgs: IContentOrdered = {
            Page: Pages.Settings,
            Permitted: true
        };
        this.$emit(SidebarEvents.ContentOrdered, orderedArgs);

        if (!orderedArgs.Permitted) {
            ev.preventDefault();
            ev.stopPropagation();
        }

        const changedArgs: IContentChanged = {
            Page: Pages.Settings
        };
        this.$emit(SidebarEvents.ContentChanged, changedArgs)
    }
}
