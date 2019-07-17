import Component from 'vue-class-component';
import ViewBase from './Bases/ViewBase';
import { IContentView } from './Bases/ContentViewBase';
import Finder from './Finders/Finder';
import HeaderBar from './HeaderBars/HeaderBar';
import Playlists from './Playlists/Playlists';
import Settings from './Settings/Settings';
import { default as Sidebar, Pages, IContentChanged, IContentOrdered } from './Sidebars/Sidebar';
import Exception from '../Utils/Exception';

@Component({
    template: `<div class="wrapper" style="height: 100%; min-height: 100%;">
    <header-bar ref="HeaderBar" />
    <sidebar
        @ContentOrdered="OnContentOrdered"
        @ContentChanged="OnContentChanged"
        ref="Sidebar" />
    <div class="content-wrapper h-100 pt-3 tab-content">
        <finder
            ref="Finder"
            @PlaylistCreated="OnPlaylistCreatedByFinder" />
        <playlists
            ref="Playlists"
            @PlaylistsUpdated="OnPlaylistsUpdatedByPlaylists" />
        <settings
            ref="Settings" />
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

    private activeContent: IContentView;

    private get HeaderBar(): HeaderBar {
        return this.$refs.HeaderBar as HeaderBar;
    }

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        this.activeContent = this.Finder;
        //this.OnContentChanged = this.OnContentChanged.bind(this);

        return true;
    }

    private OnPlaylistCreatedByFinder(): void {
        this.Playlists.RefreshPlaylist();
    }

    private OnPlaylistsUpdatedByPlaylists(): void {
        this.Finder.RefreshPlaylist();
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
        this.HeaderBar.SetHeader(args);
    }
}
