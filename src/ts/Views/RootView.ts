import Component from 'vue-class-component';
import Libraries from '../Libraries';
import { default as SettingsStore, IUpdateProgress } from '../Models/Settings/SettingsStore';
import Exception from '../Utils/Exception';
import { default as IContent, Contents, IContentArgs, IContentOrderedArgs } from './Bases/IContent';
import { IContentDetailArgs } from './Bases/IContentDetail';
import ViewBase from './Bases/ViewBase';
import Finder from './Finders/Finder';
import { default as HeaderBar } from './HeaderBars/HeaderBar';
import Playlists from './Playlists/Playlists';
import Settings from './Settings/Settings';
import Sidebar from './Sidebars/Sidebar';
import Dump from '../Utils/Dump';

@Component({
    template: `<div class="wrapper" style="height: 100%; min-height: 100%;">
    <header-bar
        ref="HeaderBar"
        @DetailOrdered="OnDetailOrdered" />
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
    private activeContent: IContent;
    private viewport = Libraries.ResponsiveBootstrapToolkit;

    private get HeaderBar(): HeaderBar {
        return this.$refs.HeaderBar as HeaderBar;
    }

    public async Initialize(): Promise<boolean> {
        Dump.Log('RootView.Initialize: Start.');
        await super.Initialize();
        Dump.Log('RootView.Initialize: Subviews Initialized.');

        (Libraries.$(window) as any).resize(
            this.viewport.changed((): void => {
                if (this.viewport.is('<=sm')) {
                    this.ContentToFullscreen();
                } else if (this.viewport.is('>sm')) {
                    this.ContentToColumn();
                }
            })
        );

        const promises: Promise<any>[] = [];
        const store = new SettingsStore();

        Dump.Log('RootView.Initialize: Before Query.');
        // 個別にawaitした方が、複数promise配列をawait Promise.all するより早い。
        const isConnectable = await store.TryConnect();
        const updateProgress = await store.GetDbUpdateProgress();

        Dump.Log('RootView.Initialize: After Query.');

        const isDbUpdating = (updateProgress.UpdateType !== 'None');
        const content = (store.Entity.IsMopidyConnectable !== true || isDbUpdating !== false)
            ? Contents.Settings
            : Contents.Finder;

        Dump.Log('RootView.Initialize: Set SubViews1');
        this.Sidebar.SetNavigation(content);
        this.isMopidyConnectable = store.Entity.IsMopidyConnectable;

        const args: IContentArgs = {
            Content: content
        }
        this.OnContentChanged(args);

        Dump.Log('RootView.Initialize: Set SubViews2');
        if (isDbUpdating) {
            this.Settings.ShowProgress(updateProgress);
        } else if (store.Entity.IsMopidyConnectable) {
            Dump.Log('RootView.Initialize: Set SubViews3');
            const existsData = await store.ExistsData();
            if (!existsData)
                this.Settings.InitialScan();
            Dump.Log('RootView.Initialize: Set SubViews4');
        }

        return true;
    }

    // #region "ナビゲーション単位の表示制御"
    private ContentToFullscreen(): void {
        this.Finder.SetSubViewToFulscreen();
        this.Playlists.SetSubViewToFulscreen();
        this.Settings.SetSubViewToFulscreen();
    }
    private ContentToColumn(): void {
        this.Finder.SetSubviewToColumn();
        this.Playlists.SetSubviewToColumn();
        this.Settings.SetSubviewToColumn();
    }

    private OnContentOrdered(args: IContentOrderedArgs): void {
        if (this.activeContent)
            args.Permitted = this.activeContent.GetIsPermitLeave();
    }

    private GetContentView(args: IContentArgs): IContent {
        switch (args.Content) {
            case Contents.Finder:
                return this.Finder;
                break;
            case Contents.Playlists:
                return this.Playlists;
                break;
            case Contents.Settings:
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
    // #endregion

    // #region "詳細機能ごとの表示制御"

    private OnDetailOrdered(args: IContentDetailArgs): void {
        switch (args.Content) {
            case Contents.Finder:
                this.Finder.ShowContentDetail(args);
                break;
            case Contents.Playlists:
                this.Playlists.ShowContentDetail(args);
                break;
            case Contents.Settings:
                this.Settings.ShowContentDetail(args);
                break;
            default:
                Exception.Throw('Unexpected Page', args);
        }
    }

    // #endregion

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
}
