import Component from 'vue-class-component';
import Exception from '../Utils/Exception';
import { IContentView } from './Bases/ContentViewBase';
import ViewBase from './Bases/ViewBase';
import Finder from './Finders/Finder';
import HeaderBar from './HeaderBars/HeaderBar';
import Playlists from './Playlists/Playlists';
import Settings from './Settings/Settings';
import { default as Sidebar, IContentArgs, IContentOrderedArgs, Pages } from './Sidebars/Sidebar';
import { default as SettingsStore, IUpdateProgress } from '../Models/Settings/SettingsStore';

@Component({
    template: `<div class="wrapper" style="height: 100%; min-height: 100%;">
    <header-bar
        ref="HeaderBar" />
    <sidebar
        @ContentOrdered="OnContentOrdered"
        @ContentChanged="OnContentChanged"
        @Show="OnShow"
        @Shown="OnShown"
        @Hide="OnHide"
        @Hidden="OnHidden"
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

    private isMopidyConnectable: boolean = false;
    private activeContent: IContentView;

    private get HeaderBar(): HeaderBar {
        return this.$refs.HeaderBar as HeaderBar;
    }

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        const promises: Promise<any>[] = [];
        const store = new SettingsStore();

        let isConnectable: boolean = false;
        let updateProgress: IUpdateProgress = null;

        promises.push(store.TryConnect()
            .then((res) => { isConnectable = res; }));
        promises.push(store.GetDbUpdateProgress()
            .then((res) => { updateProgress = res; }));

        await Promise.all(promises);

        const isDbUpdating = (updateProgress.UpdateType !== 'None');
        const page = (store.Entity.IsMopidyConnectable !== true || isDbUpdating !== false)
            ? Pages.Settings
            : Pages.Finder;

        this.Sidebar.SetNavigation(page);
        this.isMopidyConnectable = store.Entity.IsMopidyConnectable;

        const args: IContentArgs = {
            Page: page
        }
        this.OnContentChanged(args);

        if (isDbUpdating) {
            this.Settings.ShowProgress(updateProgress);
        } else if (store.Entity.IsMopidyConnectable) {
            const existsData = await store.ExistsData();
            if (!existsData)
                this.Settings.InitialScan();
        }

        return true;
    }

    private OnPlaylistUpdatedByFinder(): void {
        this.Playlists.RefreshPlaylist();
    }

    private OnPlaylistsUpdatedByPlaylists(): void {
        this.Finder.RefreshPlaylist();
    }

    private OnServerFound(): void {
        if (!this.isMopidyConnectable) {
            this.Finder.ForceRefresh();
            this.Playlists.RefreshPlaylist();
            this.isMopidyConnectable = true;
        }
    }

    private OnContentOrdered(args: IContentOrderedArgs): void {
        if (this.activeContent)
            args.Permitted = this.activeContent.GetIsPermitLeave();
    }

    private GetContentView(args: IContentArgs): IContentView {
        switch (args.Page) {
            case Pages.Finder:
                return this.Finder;
                break;
            case Pages.Playlists:
                return this.Playlists;
                break;
            case Pages.Settings:
                return this.Settings;
                break;
            default:
                Exception.Throw('Unexpected Page.', args);
        }
    }

    private OnContentChanged(args: IContentArgs): void {
        this.activeContent = this.GetContentView(args);
        this.activeContent.InitContent();
        this.HeaderBar.SetHeader(args);
    }

    private OnShow(args: IContentArgs): void {
        this.GetContentView(args).OnShow();
    }
    private OnShown(args: IContentArgs): void {
        this.GetContentView(args).OnShown();
    }
    private OnHide(args: IContentArgs): void {
        this.GetContentView(args).OnHide();
    }
    private OnHidden(args: IContentArgs): void {
        this.GetContentView(args).OnHidden();
    }
}
