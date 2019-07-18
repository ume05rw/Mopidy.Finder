import Component from 'vue-class-component';
import Exception from '../Utils/Exception';
import { IContentView } from './Bases/ContentViewBase';
import ViewBase from './Bases/ViewBase';
import Finder from './Finders/Finder';
import HeaderBar from './HeaderBars/HeaderBar';
import Playlists from './Playlists/Playlists';
import Settings from './Settings/Settings';
import { default as Sidebar, IContentChanged, IContentOrdered, Pages } from './Sidebars/Sidebar';
import SettingsStore from '../Models/Settings/SettingsStore';

@Component({
    template: `<div class="wrapper" style="height: 100%; min-height: 100%;">
    <header-bar
        ref="HeaderBar" />
    <sidebar
        @ContentOrdered="OnContentOrdered"
        @ContentChanged="OnContentChanged"
        ref="Sidebar" />
    <div class="content-wrapper h-100 pt-3 tab-content">
        <finder
            ref="Finder"
            @PlaylistUpdated="OnPlaylistUpdatedByFinder" />
        <playlists
            ref="Playlists"
            @PlaylistsUpdated="OnPlaylistsUpdatedByPlaylists" />
        <settings
            ref="Settings"
            @ServerFound="OnServerFound"/>
    </div>
</div>`,
    components: {
        'header-bar': HeaderBar,
        'sidebar': Sidebar,
        'finder': Finder,
        'playlists': Playlists,
        'settings': Settings
    }
})
export default class RootView extends ViewBase {

    private get Finder(): Finder {
        return this.$refs.Finder as Finder;
    }
    private get Playlists(): Playlists {
        return this.$refs.Playlists as Playlists;
    }
    private get Settings(): Settings {
        return this.$refs.Settings as Settings;
    }
    private get Sidebar(): Sidebar {
        return this.$refs.Sidebar as Sidebar;
    }

    private activeContent: IContentView;

    private get HeaderBar(): HeaderBar {
        return this.$refs.HeaderBar as HeaderBar;
    }

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        const store = new SettingsStore();
        const isConnectable = await store.TryConnect();

        (isConnectable)
            ? this.Sidebar.ShowFinder()
            : this.Sidebar.ShowSettings();

        const args: IContentChanged = {
            Page: (isConnectable)
                ? Pages.Finder
                : Pages.Settings
        }
        this.OnContentChanged(args);

        return true;
    }

    private OnPlaylistUpdatedByFinder(): void {
        this.Playlists.RefreshPlaylist();
    }

    private OnPlaylistsUpdatedByPlaylists(): void {
        this.Finder.RefreshPlaylist();
    }

    private OnServerFound(): void {
        this.Finder.RefreshAll();
        this.Playlists.RefreshPlaylist();
    }

    private OnContentOrdered(args: IContentOrdered): void {
        args.Permitted = this.activeContent.GetIsPermitLeave();
    }

    private OnContentChanged(args: IContentChanged): void {
        switch (args.Page) {
            case Pages.Finder:
                this.activeContent = this.Finder;
                break;
            case Pages.Playlists:
                this.activeContent = this.Playlists;
                break;
            case Pages.Settings:
                this.activeContent = this.Settings;
                break;
            default:
                Exception.Throw('Unexpected Page.', args);
        }
        this.activeContent.InitContent();
        this.HeaderBar.SetHeader(args);
    }
}
