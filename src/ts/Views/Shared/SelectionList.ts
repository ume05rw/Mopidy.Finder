import * as AdminLte from 'admin-lte/dist/js/adminlte';
import * as _ from 'lodash';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../Libraries';
import { IPagenatedResult } from '../../Models/Bases/StoreBase';
import Exception from '../../Utils/Exception';
import ViewBase from '../Bases/ViewBase';
import { WidgetEvents } from '../Events/AdminLteEvents';
import { ISelectionChangedArgs, ISelectionOrderedArgs, SelectionItemEvents } from './SelectionItem';

export interface IListUpdatedArgs<TEntity> {
    Entities: TEntity[];
}

export const SelectionEvents = {
    ListUpdated: 'ListUpdated',
    SelectionOrdered: SelectionItemEvents.SelectionOrdered,
    SelectionChanged: SelectionItemEvents.SelectionChanged,
    Refreshed: 'Refreshed',
}


export default abstract class SelectionList<TEntity, TStore> extends ViewBase {

    protected abstract store: TStore;
    protected abstract entities: TEntity[];
    protected isAutoCollapse: boolean = true;

    private page: number = 1;
    private viewport = Libraries.ResponsiveBootstrapToolkit;
    private button: JQuery;
    private boxWidget: AdminLte.Widget;
    private isCollapsed: boolean = false;

    protected get Page(): number {
        return this.page;
    }

    protected get InfiniteLoading(): InfiniteLoading {
        return (this.$refs.InfiniteLoading)
            ? this.$refs.InfiniteLoading as InfiniteLoading
            : null;
    }
    protected get ButtonCollaplse(): HTMLElement {
        return (this.$refs.ButtonCollaplse)
            ? this.$refs.ButtonCollaplse as HTMLElement
            : null;
    }
    
    /**
     * サブクラス上でsuper.Initialize()呼び出し前に isAutoCollapse をセットしておくこと。
     */
    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        if (this.isAutoCollapse) {
            this.button = Libraries.$(this.ButtonCollaplse);
            this.boxWidget = new AdminLte.Widget(this.button);

            this.button.on(WidgetEvents.Collapsed, (): void => {
                this.isCollapsed = true;
            });
            this.button.on(WidgetEvents.Expanded, (): void => {
                this.isCollapsed = false;
            });

            (Libraries.$(window) as any).resize(
                this.viewport.changed((): void => {
                    this.ToggleListByViewport();
                })
            );

            _.delay((): void => {
                this.ToggleListByViewport();
            }, 1000);
        }

        return true;
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

    protected OnClickCollapse(): void {
        this.boxWidget.toggle();
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
        _.delay((): void => {
            this.$emit(SelectionEvents.SelectionChanged, args);
        }, 300);
    }

    protected abstract async GetPagenatedList(): Promise<IPagenatedResult<TEntity>>;

    protected Refresh(): void {
        this.page = 1;
        this.entities = [];
        this.$nextTick((): void => {
            this.InfiniteLoading.stateChanger.reset();
            (this.InfiniteLoading as any).attemptLoad();
        });
    }

    protected ToggleListByViewport(): void {
        if (!this.isAutoCollapse)
            return;

        if (this.viewport.is('<=sm') && !this.isCollapsed) {
            this.boxWidget.collapse();
        } else if (this.viewport.is('>sm') && this.isCollapsed) {
            this.boxWidget.expand();
        }
    }
}
