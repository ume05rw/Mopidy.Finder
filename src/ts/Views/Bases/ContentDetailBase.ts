import { default as TabBase } from './TabBase';
import IContentDetail from './IContentDetail';


export default abstract class ContentDetailBase extends TabBase implements IContentDetail {
    protected abstract readonly tabId: string;
    protected abstract readonly linkId: string;
    private static readonly DisplayNone: string = 'd-none';

    public Show(): void {
        if (this.$el.classList.contains(ContentDetailBase.DisplayNone))
            this.$el.classList.remove(ContentDetailBase.DisplayNone);
    }

    public Hide(): void {
        if (!this.$el.classList.contains(ContentDetailBase.DisplayNone))
            this.$el.classList.add(ContentDetailBase.DisplayNone);
    }
}
