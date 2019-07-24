import Libraries from '../Libraries';
import SettingsStore from '../Models/Settings/SettingsStore';
import { Contents, default as IContent, IContentArgs, IContentOrderedArgs } from '../Views/Bases/IContent';
import Finder from '../Views/Finders/Finder';
import { default as HeaderBar } from '../Views/HeaderBars/HeaderBar';
import Playlists from '../Views/Playlists/Playlists';
import RootView from '../Views/RootView';
import Settings from '../Views/Settings/Settings';
import { default as SideBar, ITabEventRecievedArgs, SideBarEvents } from '../Views/SideBars/SideBar';
import ContentController from './ContentController';

export default class NavigationController {

    private _content: ContentController = null;
    private _headerBar: HeaderBar = null;
    private _sideBar: SideBar = null;
    private _finder: Finder = null;
    private _playlists: Playlists = null;
    private _settings: Settings = null;
    private _currentContent: IContent = null;
    private _allContents: IContent[] = [];
    private _viewport = Libraries.ResponsiveBootstrapToolkit;

    public constructor(contentController: ContentController, rootView: RootView) {
        this._content = contentController;

        this._headerBar = rootView.HeaderBar;
        this._sideBar = rootView.SideBar;

        this._finder = rootView.Finder;
        this._playlists = rootView.Playlists;
        this._settings = rootView.Settings;
        this._allContents.push(this._finder);
        this._allContents.push(this._playlists);
        this._allContents.push(this._settings);

        (Libraries.$(window) as any).resize(
            this._viewport.changed((): void => {
                this.AdjustScreen();
            })
        );

        this._sideBar.$on(SideBarEvents.ContentOrdered, (args: IContentOrderedArgs) => {
            // カレント画面の移動に支障がある場合は移動しない。
            if ((this._currentContent) && !this._currentContent.GetIsPermitLeave())
                return;

            this.SetCurrentContent(args.Content);
        });
        // Bootstrap-Tabイベントのプロキシ
        this._sideBar.$on(SideBarEvents.TabEventRecieved, (args: ITabEventRecievedArgs) => {
            this._content.EmitTabEvent(args);
        });

        this._sideBar.$on(SideBarEvents.Operated, () => {
            if (this._viewport.is('<=lg')) {
                this._headerBar.SetSideBarClose();
            }
        });

        this.AdjustScreen();

        this.InitNavigation();
    }

    private async InitNavigation(): Promise<boolean> {

        const store = new SettingsStore();

        // 個別にawaitした方が、複数promise配列をawait Promise.all するより早い。
        const isConnectable = await store.TryConnect();
        const updateProgress = await store.GetDbUpdateProgress();

        const isDbUpdating = (updateProgress.UpdateType !== 'None');
        const content = (store.Entity.IsMopidyConnectable !== true || isDbUpdating !== false)
            ? Contents.Settings
            : Contents.Finder;

        this.SetCurrentContent(content);

        if (isDbUpdating) {
            this._settings.ShowProgress(updateProgress);
        } else if (store.Entity.IsMopidyConnectable) {
            const existsData = await store.ExistsData();
            if (!existsData)
                this._settings.InitialScan();
        }

        return true;
    }

    private SetCurrentContent(content: Contents): void {
        this._sideBar.SetNavigation(content);
        this._content.SetCurrentContent(content);

        const headerArgs: IContentArgs = {
            Content: content
        };
        this._headerBar.SetHeader(headerArgs);
    }

    private AdjustScreen(): void {
        // コンテンツは、smサイズを基点にカラム<-->フルスクリーンを切り替える。
        if (this._viewport.is('<=sm')) {
            this._content.ContentToFullscreen();
        } else if (this._viewport.is('>sm')) {
            this._content.ContentToColumn();
        }

        // サイドバーは、mdサイズを基点に常時表示<-->操作終了で非表示化を切り替える。
        if (this._viewport.is('<=lg')) {
            this._headerBar.SetSideBarClose();
        } else if (this._viewport.is('>lg')) {
            this._headerBar.SetSideBarOpen();
        }
    }
}
