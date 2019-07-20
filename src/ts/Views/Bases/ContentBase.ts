import { default as TabBase } from './TabBase';
import IContent from './IContent';
import { default as IContentDetail, IContentDetailArgs } from './IContentDetail';

export default abstract class ContentBase extends TabBase implements IContent {
    protected abstract details: IContentDetail[];

    public abstract GetIsPermitLeave(): boolean;
    public abstract InitContent(): void;

    public SetSubViewToFulscreen(): void {
        for (let i = 0; i < this.details.length; i++) {
            const detail = this.details[i];
            (i === 0)
                ? detail.Show()
                : detail.Hide();
        }
    }
    public SetSubviewToColumn(): void {
        for (let i = 0; i < this.details.length; i++) {
            const detail = this.details[i];
            detail.Show();
        }
    }

    protected HideAllDetails(): void {
        for (let i = 0; i < this.details.length; i++) {
            const detail = this.details[i];
            detail.Hide();
        }
    }

    public abstract ShowContentDetail(args: IContentDetailArgs): void;
}
