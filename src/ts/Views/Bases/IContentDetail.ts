import { Contents } from './IContent';

export enum ContentDetails {
    Genres,
    Artists,
    AlbumTracks,
    Playlists,
    PlaylistTracks,
    SetMopidy,
    Database,
    ScanProgress
}

export interface IContentDetailArgs {
    Content: Contents,
    Detail: ContentDetails
}

export default interface IContentDetail {
    Show(): void;
    Hide(): void;
}
