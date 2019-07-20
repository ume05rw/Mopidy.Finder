import { default as TabViewBase, ITabView } from './TabViewBase';

export interface IContentSubView {
    Show(): void;
    Hide(): void;
}

export default abstract class ContentSubViewBase extends TabViewBase implements IContentSubView {
    protected abstract readonly tabId: string;
    protected abstract readonly linkId: string;
    private static readonly DisplayNone: string = 'd-none';

    public Show(): void {
        if (this.$el.classList.contains(ContentSubViewBase.DisplayNone))
            this.$el.classList.remove(ContentSubViewBase.DisplayNone);
    }

    public Hide(): void {
        if (!this.$el.classList.contains(ContentSubViewBase.DisplayNone))
            this.$el.classList.add(ContentSubViewBase.DisplayNone);
    }
}
