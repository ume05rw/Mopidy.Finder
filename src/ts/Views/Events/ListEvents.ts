import ISelectionItem from '../../Models/Bases/ISelectionItem';

export interface ISelectionChangedArgs {
    entity: ISelectionItem,
    selected: boolean
}

export const Events = {
    SelectionChanged: 'SelectionChanged',
    Refreshed: 'Refreshed'
}

