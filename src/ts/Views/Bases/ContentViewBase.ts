import { default as TabViewBase, ITabView } from './TabViewBase';
import { IContentSubView } from './ContentSubViewBase';
import { IContentDetailArgs } from '../HeaderBars/HeaderBar';

export interface IContentView extends ITabView {
    GetIsPermitLeave(): boolean;
    InitContent(): void;
    SetSubViewToFulscreen(isNowSelected: boolean): void;
    SetSubviewToColumn(): void;
}

export default abstract class ContentViewBase extends TabViewBase implements IContentView {
    protected abstract subviews: IContentSubView[];

    public abstract GetIsPermitLeave(): boolean;
    public abstract InitContent(): void;

    public SetSubViewToFulscreen(): void {
        for (let i = 0; i < this.subviews.length; i++) {
            const subview = this.subviews[i];
            (i === 0)
                ? subview.Show()
                : subview.Hide();
        }
    }
    public SetSubviewToColumn(): void {
        for (let i = 0; i < this.subviews.length; i++) {
            const subview = this.subviews[i];
            subview.Show();
        }
    }

    protected HideAllDetails(): void {
        for (let i = 0; i < this.subviews.length; i++) {
            const subview = this.subviews[i];
            subview.Hide();
        }
    }

    public abstract ShowContentDetail(args: IContentDetailArgs): void;
}
