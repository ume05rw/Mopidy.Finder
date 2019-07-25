import Libraries from '../Libraries';
import SettingsStore from '../Models/Settings/SettingsStore';
import { Contents, IContentOrderedArgs } from '../Views/Bases/IContent';
import { default as HeaderBar, HeaderBarEvents } from '../Views/HeaderBars/HeaderBar';
import RootView from '../Views/RootView';
import { default as SideBar, ITabEventRecievedArgs, SideBarEvents } from '../Views/SideBars/SideBar';
import ContentController from './ContentController';
import Dump from '../Utils/Dump';

export default class NavigationController {

    private static readonly TouchScreenClass = 'touchable';
    private static readonly NonTouchScreenClass = 'nontouchable';

    private _content: ContentController = null;
    private _rootView: RootView = null;
    private _headerBar: HeaderBar = null;
    private _sideBar: SideBar = null;
    private _viewport = Libraries.ResponsiveBootstrapToolkit;
    private _store: SettingsStore;

    public constructor(contentController: ContentController, rootView: RootView) {
        this._content = contentController;
        this._rootView = rootView;
        this._headerBar = this._rootView.HeaderBar;
        this._sideBar = this._rootView.SideBar;
        this._store = new SettingsStore();

        (Libraries.$(window) as any).resize(
            this._viewport.changed((): void => {
                this.AdjustScreen();
            })
        );

        this._headerBar.$on(HeaderBarEvents.SideBarShown, () => {
            this._sideBar.OnShown();
        });
        this._headerBar.$on(HeaderBarEvents.SideBarCollapsed, () => {
            this._sideBar.OnCollapsed();
        });

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

        this.InitialNavigation();
    }

    private async InitialNavigation(): Promise<boolean> {
        // 個別にawaitした方が、複数promise配列をawait Promise.all するより早い。
        await this._store.TryConnect();
        const updateProgress = await this._store.GetDbUpdateProgress();

        // どうも、ResponsiveToolkitの初期化後から反応が正しくなるまで
        // すこし時間がかかるっぽい。
        // Settingsクエリが終わるまで待ってからAdjustする。
        this.AdjustScreen();
        (this._headerBar.GetIsSideBarVisible())
            ? this._sideBar.OnShown()
            : this._sideBar.OnCollapsed();


        const isDbUpdating = (updateProgress.UpdateType !== 'None');
        const content = (this._store.Entity.IsMopidyConnectable !== true || isDbUpdating !== false)
            ? Contents.Settings
            : Contents.Finder;

        this._content.SetCurrentContent(content);

        if (isDbUpdating) {
            this._content.ShowSettingsDbProgress(updateProgress);
        } else if (this._store.Entity.IsMopidyConnectable) {
            const existsData = await this._store.ExistsData();
            if (!existsData)
                this._content.ShowSettingsInitialScan();
        }

        return true;
    }

    private AdjustScreen(): void {
        
        Dump.Log('viewport = ' + this._viewport.current());
        // コンテンツは、smサイズを基点にカラム<-->フルスクリーンを切り替える。
        if (this._viewport.is('<=md')) {
            Dump.Log('viewport is <=md');
            this._content.ContentToFullscreen();
        } else {
            Dump.Log('viewport is >md');
            this._content.ContentToColumn();
        }

        // サイドバーは、lgサイズを基点に常時表示<-->操作終了で非表示化を切り替える。
        if (this._viewport.is('<=lg')) {
            Dump.Log('viewport is <=lg');
            this._headerBar.SetSideBarClose();
        } else {
            Dump.Log('viewport is >lg');
            this._headerBar.SetSideBarOpen();
        }

        const rootClasses = (this._rootView.$el as HTMLElement).classList;
        if (this._store.Entity.IsTouchScreen) {
            if (!rootClasses.contains(NavigationController.TouchScreenClass))
                rootClasses.add(NavigationController.TouchScreenClass);
            if (rootClasses.contains(NavigationController.NonTouchScreenClass))
                rootClasses.remove(NavigationController.NonTouchScreenClass);
        } else {
            if (rootClasses.contains(NavigationController.TouchScreenClass))
                rootClasses.remove(NavigationController.TouchScreenClass);
            if (!rootClasses.contains(NavigationController.NonTouchScreenClass))
                rootClasses.add(NavigationController.NonTouchScreenClass);            
        }

        this.ToFullscreenIfAndroidChrome();
    }

    private ToFullscreenIfAndroidChrome(): void {
        // Android判定
        // https://gist.github.com/sayaka-nonsta/d68d4afc7b08d52971f2d477adab5e1d
        // フルスクリーン要求
        // https://developers.google.com/web/fundamentals/native-hardware/fullscreen/
        const doc = (window)
            ? window.document
            : null;
        const docEl = (doc)
            ? doc.documentElement as any
            : null;
        const requestFullScreen = (docEl)
            ? docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen
            : null;
        if (this._store.Entity.IsAndroid) {
            try {
                if (requestFullScreen)
                    requestFullScreen.call(docEl);
            } catch (ex) {
                Dump.Error('Fullscreen Request Failed.', ex)
            }
        }
    }
}
