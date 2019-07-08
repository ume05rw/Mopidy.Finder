import ISelectionItem from '../../Models/Bases/ISelectionItem';

export interface ISelectionChangedArgs {
    Entity: ISelectionItem;
    Selected: boolean;
}

export interface IListAppendedArgs {
    Entities: ISelectionItem[];
}

export interface ITrackSelected {
    AlbumId: number;
    TrackId: number;
}

export const Events = {
    SelectionChanged: 'SelectionChanged',
    Refreshed: 'Refreshed',
    TrackSelected: 'TrackSelected'
}
