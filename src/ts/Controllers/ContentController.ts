import { IUpdateProgress } from '../Models/Settings/SettingsStore';
import Exception from '../Utils/Exception';
import { Contents, default as IContent, IContentArgs } from '../Views/Bases/IContent';
import { IContentDetailArgs, ContentDetails, ContentDetailEvents, IContentSwipeArgs, SwipeDirection } from '../Views/Bases/IContentDetail';
import { TabEvents } from '../Views/Bases/TabBase';
import { default as Finder, FinderEvents } from '../Views/Finders/Finder';
import { default as HeaderBar, HeaderBarEvents } from '../Views/HeaderBars/HeaderBar';
import { default as Playlists, PlaylistsEvents } from '../Views/Playlists/Playlists';
import RootView from '../Views/RootView';
import { default as Settings, SettingsEvents } from '../Views/Settings/Settings';
import { default as SideBar, ITabEventRecievedArgs } from '../Views/SideBars/SideBar';
import Dump from '../Utils/Dump';

export default class ContentController {

    private _headerBar: HeaderBar = null;
    private _sideBar: SideBar = null;
    private _finder: Finder = null;
    private _playlists: Playlists = null;
    private _settings: Settings = null;
    private _currentContent: IContent = null;
    private _allContents: IContent[] = [];
    private _isFullscreen: boolean = false;

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

        this._finder.$on(ContentDetailEvents.Swiped, (args: IContentSwipeArgs) => {
            if (!this._isFullscreen)
                return;

            if (args.Direction === SwipeDirection.Right && args.ContentDetail === null) {
                this._headerBar.SetSideBarOpen();
            } else if (args.ContentDetail) {
                const detailArgs: IContentDetailArgs = {
                    Content: Contents.Finder,
                    Detail: args.ContentDetail
                };
                this._finder.ShowContentDetail(detailArgs);
            }
        });
        this._playlists.$on(ContentDetailEvents.Swiped, (args: IContentSwipeArgs) => {
            if (!this._isFullscreen)
                return;

            if (args.Direction === SwipeDirection.Right && args.ContentDetail === null) {
                this._headerBar.SetSideBarOpen();
            } else if (args.ContentDetail) {
                const detailArgs: IContentDetailArgs = {
                    Content: Contents.Playlists,
                    Detail: args.ContentDetail
                };
                this._playlists.ShowContentDetail(detailArgs);
            }
        });
        this._settings.$on(ContentDetailEvents.Swiped, (args: IContentSwipeArgs) => {
            if (!this._isFullscreen)
                return;

            if (args.Direction === SwipeDirection.Right && args.ContentDetail === null) {
                this._headerBar.SetSideBarOpen();
            } else if (args.ContentDetail) {
                const detailArgs: IContentDetailArgs = {
                    Content: Contents.Settings,
                    Detail: args.ContentDetail
                };
                this._settings.ShowContentDetail(detailArgs);
            }
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
        this._isFullscreen = true;
        for (let i = 0; i < this._allContents.length; i++)
            this._allContents[i].SetDetailToFulscreen();
    }
    public ContentToColumn(): void {
        this._isFullscreen = false;
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

    //private OnFinderSwiped(args: IContentSwipeArgs): void {
    //    if (!this._isDetailFullscreen)
    //        return;

    //    let isSideBarOrdered = false;
    //    let target: ContentDetails = null;
    //    if (args.Direction == SwipeDirection.Left) {
    //        // 左へ=>進む
    //        switch (args.ContentDetail) {
    //            case ContentDetails.Genres:
    //                target = ContentDetails.Artists;
    //                break;
    //            case ContentDetails.Artists:
    //                target = ContentDetails.AlbumTracks;
    //                break;
    //            case ContentDetails.AlbumTracks:
    //                break;
    //            default:
    //                Exception.Throw('Unexpected ContentDetail.', args);
    //        }
    //    } else if (args.Direction == SwipeDirection.Right) {
    //        // 右へ=>戻る
    //        switch (args.ContentDetail) {
    //            case ContentDetails.Genres:
    //                isSideBarOrdered = true;
    //                break;
    //            case ContentDetails.Artists:
    //                target = ContentDetails.Genres;
    //                break;
    //            case ContentDetails.AlbumTracks:
    //                target = ContentDetails.Artists;
    //                break;
    //            default:
    //                Exception.Throw('Unexpected ContentDetail.', args);
    //        }
    //    }

    //    Dump.Log('ContentController.OnFinderSwiped', {
    //        args: args,
    //        isSideBarOrdered: isSideBarOrdered,
    //        target: target
    //    });
    //}

    //private OnPlaylistsSwiped(args: IContentSwipeArgs): void {
    //    if (!this._isDetailFullscreen)
    //        return;

    //    let isSideBarOrdered = false;
    //    let target: ContentDetails = null;
    //    if (args.Direction == SwipeDirection.Left) {
    //        // 左へ=>進む
    //        switch (args.ContentDetail) {
    //            case ContentDetails.Playlists:
    //                target = ContentDetails.PlaylistTracks;
    //                break;
    //            case ContentDetails.PlaylistTracks:
    //                break;
    //            default:
    //                Exception.Throw('Unexpected ContentDetail.', args);
    //        }
    //    } else if (args.Direction == SwipeDirection.Right) {
    //        // 右へ=>戻る
    //        switch (args.ContentDetail) {
    //            case ContentDetails.Playlists:
    //                isSideBarOrdered = true;
    //                break;
    //            case ContentDetails.PlaylistTracks:
    //                target = ContentDetails.Playlists;
    //                break;
    //            default:
    //                Exception.Throw('Unexpected ContentDetail.', args);
    //        }
    //    }

    //    Dump.Log('ContentController.OnPlaylistsSwiped', {
    //        args: args,
    //        isSideBarOrdered: isSideBarOrdered,
    //        target: target
    //    });
    //}

    //private OnSettingsSwiped(args: IContentSwipeArgs): void {
    //    if (!this._isDetailFullscreen)
    //        return;

    //    let isSideBarOrdered = false;
    //    let target: ContentDetails = null;
    //    if (args.Direction == SwipeDirection.Left) {
    //        // 左へ=>進む
    //        switch (args.ContentDetail) {
    //            case ContentDetails.SetMopidy:
    //                target = ContentDetails.Database;
    //                break;
    //            case ContentDetails.Database:
    //                target = ContentDetails.ScanProgress;
    //                break;
    //            case ContentDetails.ScanProgress:
    //                break;
    //            default:
    //                Exception.Throw('Unexpected ContentDetail.', args);
    //        }
    //    } else if (args.Direction == SwipeDirection.Right) {
    //        // 右へ=>戻る
    //        switch (args.ContentDetail) {
    //            case ContentDetails.SetMopidy:
    //                isSideBarOrdered = true;
    //                break;
    //            case ContentDetails.Database:
    //                target = ContentDetails.SetMopidy;
    //                break;
    //            case ContentDetails.ScanProgress:
    //                target = ContentDetails.Database;
    //                break;
    //            default:
    //                Exception.Throw('Unexpected ContentDetail.', args);
    //        }
    //    }

    //    Dump.Log('ContentController.OnSettingsSwiped', {
    //        args: args,
    //        isSideBarOrdered: isSideBarOrdered,
    //        target: target
    //    });
    //}
}
