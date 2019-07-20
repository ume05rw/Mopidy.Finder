import Component from 'vue-class-component';
import Libraries from '../../Libraries';
import Exception from '../../Utils/Exception';
import { Contents, IContentArgs, IContentOrderedArgs } from '../Bases/IContent';
import { TabEvents } from '../Bases/TabBase';
import ViewBase from '../Bases/ViewBase';
import { TabEvents as BsTabEvents } from '../Events/BootstrapEvents';
import PlayerPanel from './PlayerPanel';

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
                        <a class="nav-link"
                            id="nav-finder"
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
                        <a class="nav-link"
                            id="nav-playlists"
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
                        <a class="nav-link"
                            id="nav-settings"
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

        this.finderTabAnchor.on(BsTabEvents.Show, () => {
            const args: IContentArgs = { Content: Contents.Finder };
            this.$emit(TabEvents.Show, args);
        });
        this.finderTabAnchor.on(BsTabEvents.Shown, () => {
            const args: IContentArgs = { Content: Contents.Finder };
            this.$emit(TabEvents.Shown, args);
        });
        this.finderTabAnchor.on(BsTabEvents.Hide, () => {
            const args: IContentArgs = { Content: Contents.Finder };
            this.$emit(TabEvents.Hide, args);
        });
        this.finderTabAnchor.on(BsTabEvents.Hidden, () => {
            const args: IContentArgs = { Content: Contents.Finder };
            this.$emit(TabEvents.Hidden, args);
        });

        this.playlistsTabAnchor.on(BsTabEvents.Show, () => {
            const args: IContentArgs = { Content: Contents.Playlists };
            this.$emit(TabEvents.Show, args);
        });
        this.playlistsTabAnchor.on(BsTabEvents.Shown, () => {
            const args: IContentArgs = { Content: Contents.Playlists };
            this.$emit(TabEvents.Shown, args);
        });
        this.playlistsTabAnchor.on(BsTabEvents.Hide, () => {
            const args: IContentArgs = { Content: Contents.Playlists };
            this.$emit(TabEvents.Hide, args);
        });
        this.playlistsTabAnchor.on(BsTabEvents.Hidden, () => {
            const args: IContentArgs = { Content: Contents.Playlists };
            this.$emit(TabEvents.Hidden, args);
        });

        this.settingsTabAnchor.on(BsTabEvents.Show, () => {
            const args: IContentArgs = { Content: Contents.Settings };
            this.$emit(TabEvents.Show, args);
        });
        this.settingsTabAnchor.on(BsTabEvents.Shown, () => {
            const args: IContentArgs = { Content: Contents.Settings };
            this.$emit(TabEvents.Shown, args);
        });
        this.settingsTabAnchor.on(BsTabEvents.Hide, () => {
            const args: IContentArgs = { Content: Contents.Settings };
            this.$emit(TabEvents.Hide, args);
        });
        this.settingsTabAnchor.on(BsTabEvents.Hidden, () => {
            const args: IContentArgs = { Content: Contents.Settings };
            this.$emit(TabEvents.Hidden, args);
        });


        return true;
    }

    public SetNavigation(page: Contents): void {
        switch (page) {
            case Contents.Finder:
                this.finderTabAnchor.tab(Sidebar.ShowTabMethod);
                break;
            case Contents.Playlists:
                this.playlistsTabAnchor.tab(Sidebar.ShowTabMethod);
                break;
            case Contents.Settings:
                this.settingsTabAnchor.tab(Sidebar.ShowTabMethod);
                break;
            default:
                Exception.Throw('Unexpected Page Ordered.', page);
        }
    }

    private OnClickFinder(ev: MouseEvent): void {
        const orderedArgs: IContentOrderedArgs = {
            Content: Contents.Finder,
            Permitted: true
        };
        this.$emit(SidebarEvents.ContentOrdered, orderedArgs);

        if (!orderedArgs.Permitted) {
            ev.preventDefault();
            ev.stopPropagation();
        }

        const changedArgs: IContentArgs = {
            Content: Contents.Finder
        };
        this.$emit(SidebarEvents.ContentChanged, changedArgs)
    }

    private OnClickPlaylists(ev: MouseEvent): void {
        const orderedArgs: IContentOrderedArgs = {
            Content: Contents.Playlists,
            Permitted: true
        };
        this.$emit(SidebarEvents.ContentOrdered, orderedArgs);

        if (!orderedArgs.Permitted) {
            ev.preventDefault();
            ev.stopPropagation();
        }

        const changedArgs: IContentArgs = {
            Content: Contents.Playlists
        };
        this.$emit(SidebarEvents.ContentChanged, changedArgs)
    }

    private OnClickSettings(ev: MouseEvent): void {
        const orderedArgs: IContentOrderedArgs = {
            Content: Contents.Settings,
            Permitted: true
        };
        this.$emit(SidebarEvents.ContentOrdered, orderedArgs);

        if (!orderedArgs.Permitted) {
            ev.preventDefault();
            ev.stopPropagation();
        }

        const changedArgs: IContentArgs = {
            Content: Contents.Settings
        };
        this.$emit(SidebarEvents.ContentChanged, changedArgs)
    }
}
