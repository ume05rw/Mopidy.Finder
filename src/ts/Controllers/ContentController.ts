import { IUpdateProgress } from '../Models/Settings/SettingsStore';
import Exception from '../Utils/Exception';
import { Contents, default as IContent, IContentArgs } from '../Views/Bases/IContent';
import { IContentDetailArgs } from '../Views/Bases/IContentDetail';
import { TabEvents } from '../Views/Bases/TabBase';
import { default as Finder, FinderEvents } from '../Views/Finders/Finder';
import { default as HeaderBar, HeaderBarEvents } from '../Views/HeaderBars/HeaderBar';
import { default as Playlists, PlaylistsEvents } from '../Views/Playlists/Playlists';
import RootView from '../Views/RootView';
import { default as Settings, SettingsEvents } from '../Views/Settings/Settings';
import { default as SideBar, ITabEventRecievedArgs } from '../Views/SideBars/SideBar';

export default class ContentController {

    private _headerBar: HeaderBar = null;
    private _sideBar: SideBar = null;
    private _finder: Finder = null;
    private _playlists: Playlists = null;
    private _settings: Settings = null;
    private _currentContent: IContent = null;
    private _allContents: IContent[] = [];


    public constructor(rootView: RootView) {
        this._headerBar = rootView.HeaderBar;
        this._sideBar = rootView.SideBar;
        this._finder = rootView.Finder;
        this._playlists = rootView.Playlists;
        this._settings = rootView.Settings;
        this._allContents.push(this._finder);
        this._allContents.push(this._playlists);
        this._allContents.push(this._settings);

        this._headerBar.$on(HeaderBarEvents.DetailOrdered, (args: IContentDetailArgs) => {
            this.GetContent(args.Content).ShowContentDetail(args);
        });

        this._finder.$on(FinderEvents.PlaylistUpdated, () => {
            this._playlists.RefreshPlaylist();
        });
        this._playlists.$on(PlaylistsEvents.PlaylistsUpdated, () => {
            this._finder.RefreshPlaylist();
        });
        this._settings.$on(SettingsEvents.ServerFound, () => {
            this._finder.ForceRefresh();
            this._playlists.RefreshPlaylist();
        });
    }

    public EmitTabEvent(args: ITabEventRecievedArgs): void {
        switch (args.Event) {
            case TabEvents.Show:
                this.GetContent(args.Content).OnShow();
                break;
            case TabEvents.Shown:
                this.GetContent(args.Content).OnShown();
                break;
            case TabEvents.Hide:
                this.GetContent(args.Content).OnHide();
                break;
            case TabEvents.Hidden:
                this.GetContent(args.Content).OnHidden();
                break;
            default:
                Exception.Throw('Unexpected TabEvent.', args);
        }
    }

    private GetContent(content: Contents): IContent {
        switch (content) {
            case Contents.Finder:
                return this._finder;
            case Contents.Playlists:
                return this._playlists;
            case Contents.Settings:
                return this._settings;
            default:
                Exception.Throw('Unexpected Content.', content);
        }
    }

    public SetCurrentContent(content: Contents): void {
        this._sideBar.SetNavigation(content);
        const headerArgs: IContentArgs = {
            Content: content
        };
        this._headerBar.SetHeader(headerArgs);

        this._currentContent = this.GetContent(content);
        this._currentContent.InitContent();
    }

    public CanLeave(): boolean {
        return (!this._currentContent)
            ? true
            : this._currentContent.GetIsPermitLeave();
    }

    public ContentToFullscreen(): void {
        for (let i = 0; i < this._allContents.length; i++)
            this._allContents[i].SetDetailToFulscreen();
    }
    public ContentToColumn(): void {
        for (let i = 0; i < this._allContents.length; i++)
            this._allContents[i].SetDetailToColumn();
    }

    public ShowSettingsDbProgress(updateProgress: IUpdateProgress): void {
        if (this._currentContent !== this._settings)
            this.SetCurrentContent(Contents.Settings);

        this._settings.ShowProgress(updateProgress);
    }

    public ShowSettingsInitialScan(): void {
        if (this._currentContent !== this._settings)
            this.SetCurrentContent(Contents.Settings);

        this._settings.InitialScan();
    }
}
