import * as _ from 'lodash';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../Libraries';
import { IPagenatedResult } from '../../Models/Bases/StoreBase';
import Exception from '../../Utils/Exception';
import ContentDetailBase from '../Bases/ContentDetailBase';
import SelectionItem, { ISelectionChangedArgs, ISelectionOrderedArgs, SelectionItemEvents } from '../Shared/SelectionItem';

export interface IListUpdatedArgs<TEntity> {
    Entities: TEntity[];
}

export const SelectionEvents = {
    ListUpdated: 'ListUpdated',
    SelectionOrdered: SelectionItemEvents.SelectionOrdered,
    SelectionChanged: SelectionItemEvents.SelectionChanged,
    Refreshed: 'Refreshed',
}


export default abstract class SelectionListBase<TEntity, TStore> extends ContentDetailBase {

    private static readonly RefreshWaitMsec: number = 100;

    protected abstract readonly isMultiSelect: boolean;
    protected abstract readonly tabId: string;
    protected abstract readonly linkId: string;
    protected abstract store: TStore;
    protected abstract entities: TEntity[];

    private page: number = 1;
    private viewport = Libraries.ResponsiveBootstrapToolkit;
    private refreshTimer: number = null;

    protected get Page(): number {
        return this.page;
    }

    protected get InfiniteLoading(): InfiniteLoading {
        return (this.$refs.InfiniteLoading)
            ? this.$refs.InfiniteLoading as InfiniteLoading
            : null;
    }
    
    protected async OnInfinite($state: StateChanger): Promise<boolean> {

        try {
            const result = await this.GetPagenatedList();

            let isUpdated = false;
            if (0 < result.ResultList.length) {
                this.entities = this.entities.concat(result.ResultList);
                isUpdated = true;
            }

            if (this.entities.length < result.TotalLength) {
                $state.loaded();
                this.page++;
            } else {
                $state.complete();
            }

            if (isUpdated) {
                const args: IListUpdatedArgs<TEntity> = {
                    Entities: this.entities
                };
                this.$emit(SelectionEvents.ListUpdated, args);
            }
        } catch (e) {
            Exception.Throw(null, e);
        }

        return true;
    }

    protected OnClickRefresh(): void {
        this.Refresh();
        this.$emit(SelectionEvents.Refreshed);
    }

    protected async OnSelectionOrdered(args: ISelectionOrderedArgs<TEntity>): Promise<boolean> {
        this.$emit(SelectionEvents.SelectionOrdered, args);

        return args.Permitted;
    }

    protected OnSelectionChanged(args: ISelectionChangedArgs<TEntity>): void {
        if (
            !this.isMultiSelect
            && args.Selected
            && this.$refs.Items instanceof Array
            && this.$refs.Items.length >= 1
            && this.$refs.Items[0] instanceof SelectionItem
        ) {
            _.each(this.$refs.Items, (si: SelectionItem<TEntity>): void => {
                if (si.GetEntity() !== args.Entity && si.GetSelected()) {
                    si.SetSelected(false);
                }
            });
        }

        _.delay((): void => {
            this.$emit(SelectionEvents.SelectionChanged, args);
        }, 300);
    }

    protected abstract async GetPagenatedList(): Promise<IPagenatedResult<TEntity>>;

    protected Refresh(): void {
        if (this.refreshTimer !== null) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }

        this.refreshTimer = setTimeout(() => {
            this.page = 1;
            this.entities = [];
            this.$nextTick((): void => {
                this.InfiniteLoading.stateChanger.reset();
                (this.InfiniteLoading as any).attemptLoad();
            });
        }, SelectionListBase.RefreshWaitMsec);
    }
}
