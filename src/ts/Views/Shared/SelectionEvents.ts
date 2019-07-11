export interface ISelectionChangedArgs<TEntity> {
    Entity: TEntity;
    Selected: boolean;
}

export interface IListUpdatedArgs<TEntity> {
    Entities: TEntity[];
}

const SelectionEvents = {
    ListUpdated: 'ListUpdated',
    SelectionChanged: 'SelectionChanged',
    Refreshed: 'Refreshed',
}

export default SelectionEvents;
