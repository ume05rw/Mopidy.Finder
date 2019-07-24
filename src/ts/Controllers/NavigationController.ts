import Libraries from '../Libraries';
import SettingsStore from '../Models/Settings/SettingsStore';
import { Contents, IContentOrderedArgs } from '../Views/Bases/IContent';
import { default as HeaderBar } from '../Views/HeaderBars/HeaderBar';
import RootView from '../Views/RootView';
import { default as SideBar, ITabEventRecievedArgs, SideBarEvents } from '../Views/SideBars/SideBar';
import ContentController from './ContentController';

export default class NavigationController {

    private _content: ContentController = null;
    private _headerBar: HeaderBar = null;
    private _sideBar: SideBar = null;
    private _viewport = Libraries.ResponsiveBootstrapToolkit;

    public constructor(contentController: ContentController, rootView: RootView) {
        this._content = contentController;
        this._headerBar = rootView.HeaderBar;
        this._sideBar = rootView.SideBar;

        (Libraries.$(window) as any).resize(
            this._viewport.changed((): void => {
                this.AdjustScreen();
            })
        );

        this._sideBar.$on(SideBarEvents.ContentOrdered, (args: IContentOrderedArgs) => {
            // カレント画面の移動に支障がある場合は移動しない。
            args.Permitted = this._content.CanLeave();
            if (!args.Permitted)
                return;

            this._content.SetCurrentContent(args.Content);
        });
        // Bootstrap-Tabイベントのプロキシ
        this._sideBar.$on(SideBarEvents.TabEventRecieved, (args: ITabEventRecievedArgs) => {
            this._content.EmitTabEvent(args);
        });

        this._sideBar.$on(SideBarEvents.Operated, () => {
            if (this._viewport.is('<=lg'))
                this._headerBar.SetSideBarClose();
        });

        this.AdjustScreen();

        this.InitialNavigation();
    }

    private async InitialNavigation(): Promise<boolean> {
        const store = new SettingsStore();

        // 個別にawaitした方が、複数promise配列をawait Promise.all するより早い。
        const isConnectable = await store.TryConnect();
        const updateProgress = await store.GetDbUpdateProgress();

        const isDbUpdating = (updateProgress.UpdateType !== 'None');
        const content = (store.Entity.IsMopidyConnectable !== true || isDbUpdating !== false)
            ? Contents.Settings
            : Contents.Finder;

        this._content.SetCurrentContent(content);

        if (isDbUpdating) {
            this._content.ShowSettingsDbProgress(updateProgress);
        } else if (store.Entity.IsMopidyConnectable) {
            const existsData = await store.ExistsData();
            if (!existsData)
                this._content.ShowSettingsInitialScan();
        }

        return true;
    }

    private AdjustScreen(): void {
        // コンテンツは、smサイズを基点にカラム<-->フルスクリーンを切り替える。
        if (this._viewport.is('<=sm')) {
            this._content.ContentToFullscreen();
        } else if (this._viewport.is('>sm')) {
            this._content.ContentToColumn();
        }

        // サイドバーは、lgサイズを基点に常時表示<-->操作終了で非表示化を切り替える。
        if (this._viewport.is('<=lg')) {
            this._headerBar.SetSideBarClose();
        } else if (this._viewport.is('>lg')) {
            this._headerBar.SetSideBarOpen();
        }
    }
}
