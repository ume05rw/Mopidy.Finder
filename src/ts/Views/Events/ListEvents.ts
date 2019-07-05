import ISelectionItem from '../../Models/Bases/ISelectionItem';

export interface ISelectionChangedArgs {
    entity: ISelectionItem,
    selected: boolean
}

export interface IListAppendedArgs {
    entities: ISelectionItem[]
}

export const Events = {
    SelectionChanged: 'SelectionChanged',
    Refreshed: 'Refreshed',
    ListAppended: 'ListAppended'
}
