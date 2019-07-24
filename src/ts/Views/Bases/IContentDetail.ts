import { Contents } from './IContent';

export enum ContentDetails {
    Genres = 'Genres',
    Artists = 'Artists',
    AlbumTracks = 'AlbumTracks',
    Playlists = 'Playlists',
    PlaylistTracks = 'PlaylistTracks',
    SetMopidy = 'SetMopidy',
    Database = 'Database',
    ScanProgress = 'ScanProgress'
}

export interface IContentDetailArgs {
    Content: Contents,
    Detail: ContentDetails
}

export default interface IContentDetail {
    Show(): void;
    Hide(): void;
}

export enum SwipeDirection {
    Left,
    Right,
    Up,
    Down
};

export interface IContentSwipeArgs {
    Direction: SwipeDirection;
    Content: Contents;
    ContentDetail: ContentDetails
}

export const ContentDetailEvents = {
    Swiped: 'Swiped'
};
