/// <reference path="../../../../types/adminlte/index.d.ts" />
import * as AdminLte from 'admin-lte/dist/js/adminlte';
import * as _ from 'lodash';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../Libraries';
import { default as StoreBase, PagenatedResult } from '../../Models/Bases/StoreBase';
import ViewBase from '../Bases/ViewBase';
import { WidgetEvents } from '../Events/AdminLteEvents';
import { default as SelectionEvents, IListUpdatedArgs, ISelectionChangedArgs } from './SelectionEvents';

export default abstract class SelectionList<TEntity, TStore> extends ViewBase {

    protected abstract store: TStore;
    protected abstract entities: TEntity[];
    protected isAutoCollapse: boolean = true;

    private page: number = 1;
    private viewport = Libraries.ResponsiveBootstrapToolkit;
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
            const button = Libraries.$(this.ButtonCollaplse);
            this.boxWidget = new AdminLte.Widget(button);

            button.on(WidgetEvents.Collapsed, () => {
                this.isCollapsed = true;
            });
            button.on(WidgetEvents.Expanded, () => {
                this.isCollapsed = false;
            });

            (Libraries.$(window) as any).resize(
                this.viewport.changed(() => {
                    this.ToggleListByViewport();
                })
            );

            _.delay(() => {
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
                this.$emit(SelectionEvents.ListUpdated, {
                    Entities: this.entities
                } as IListUpdatedArgs<TEntity>);
            }
        } catch (e) {
            console.error(e);
            console.error(this);
        }

        return true;
    }

    protected OnCollapseClick(): void {
        this.boxWidget.toggle();
    }

    protected OnClickRefresh(): void {
        this.Refresh();
        this.$emit(SelectionEvents.Refreshed);
    }

    protected OnSelectionChanged(args: ISelectionChangedArgs<TEntity>): void {
        this.$emit(SelectionEvents.SelectionChanged, args);
    }

    protected abstract async GetPagenatedList(): Promise<PagenatedResult<TEntity>>;

    protected Refresh(): void {
        this.page = 1;
        this.entities = [];
        this.$nextTick(() => {
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
