import { ITab } from './TabBase';
import { IContentDetailArgs } from './IContentDetail';

export enum Contents {
    Finder = 'Finder',
    Playlists = 'Playlists',
    Settings = 'Settings'
}
export interface IContentArgs {
    Content: Contents;
}
export interface IContentOrderedArgs extends IContentArgs {
    Permitted: boolean;
}

export default interface IContent extends ITab {
    GetIsPermitLeave(): boolean;
    InitContent(): void;
    SetDetailToFulscreen(): void;
    SetDetailToColumn(): void;
    ShowContentDetail(args: IContentDetailArgs): void;
}
