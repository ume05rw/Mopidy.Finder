import Component from 'vue-class-component';
import Libraries from '../../Libraries';
import Exception from '../../Utils/Exception';
import ViewBase from '../Bases/ViewBase';
import PlayerPanel from './PlayerPanel';

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
    template: `<aside class="main-sidebar sidebar-dark-warning elevation-4">
    <div class="brand-link navbar-secondary">
        <span class="brand-text font-weight-light">Mopidy.Finder</span>
    </div>
    <section
        class="sidebar"
        ref="SidebarSection">
        <div class="w-100 inner-sidebar">
            <nav class="mt-2">
                <ul class="nav nav-pills nav-sidebar flex-column" role="tablist">
                    <li class="nav-item">
                        <a  class="nav-link"
                            href="#tab-finder"
                            role="tab"
                            data-toggle="tab"
                            aria-controls="tab-finder"
                            aria-selected="false"
                            ref="FinderAnchor"
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
                            ref="PlaylistsAnchor"
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
                            ref="SettingsAnchor"
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
    </section>
</aside>`,
    components: {
        'player-panel': PlayerPanel
    }
})
export default class Sidebar extends ViewBase {

    private static readonly ShowTabMethod = 'show';

    private finderTabAnchor: JQuery;
    private playlistsTabAnchor: JQuery;
    private settingsTabAnchor: JQuery;

    private get SidebarSection(): HTMLTableSectionElement {
        return this.$refs.SidebarSection as HTMLTableSectionElement;
    }
    private get FinderAnchor(): HTMLAnchorElement {
        return this.$refs.FinderAnchor as HTMLAnchorElement;
    }
    private get PlaylistsAnchor(): HTMLAnchorElement {
        return this.$refs.PlaylistsAnchor as HTMLAnchorElement;
    }
    private get SettingsAnchor(): HTMLAnchorElement {
        return this.$refs.SettingsAnchor as HTMLAnchorElement;
    }

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        Libraries.SlimScroll(this.SidebarSection, {
            height: 'calc(100%)'
        });

        this.finderTabAnchor = Libraries.$(this.FinderAnchor);
        this.playlistsTabAnchor = Libraries.$(this.PlaylistsAnchor);
        this.settingsTabAnchor = Libraries.$(this.SettingsAnchor);

        return true;
    }

    public SetNavigation(page: Pages): void {
        switch (page) {
            case Pages.Finder:
                this.finderTabAnchor.tab(Sidebar.ShowTabMethod);
                break;
            case Pages.Playlists:
                this.playlistsTabAnchor.tab(Sidebar.ShowTabMethod);
                break;
            case Pages.Settings:
                this.settingsTabAnchor.tab(Sidebar.ShowTabMethod);
                break;
            default:
                Exception.Throw('Unexpected Page Ordered.', page);
        }
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
