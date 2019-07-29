import { Contents } from './IContent';

export enum ContentDetails {
    Genres = 'Genres',
    Artists = 'Artists',
    AlbumTracks = 'AlbumTracks',
    Playlists = 'Playlists',
    PlaylistTracks = 'PlaylistTracks',
    SetMopidy = 'SetMopidy',
    Database = 'Database',
    ScanProgress = 'ScanProgress',
    Thanks = 'Thanks'
}

export interface IContentDetailArgs {
    Content: Contents;
    Detail: ContentDetails;
}

export default interface IContentDetail {
    ToPositionStatic(): void;
    ToPositionAbsolute(): void;
    ToVisible(): void;
    ToHide(): void;
    GetIsVisible(): boolean;
    SlideInRight(): Promise<boolean>;
    SlideInLeft(): Promise<boolean>;
    SlideOutRight(): Promise<boolean>;
    SlideOutLeft(): Promise<boolean>;
}

export enum SwipeDirection {
    Left,
    Right,
    Up,
    Down
}

export interface IContentSwipeArgs {
    Direction: SwipeDirection;
    Content: Contents;
    ContentDetail: ContentDetails;
}

export const ContentDetailEvents = {
    Swiped: 'Swiped'
};
