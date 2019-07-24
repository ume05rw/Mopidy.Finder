import { default as TabBase } from './TabBase';
import IContent from './IContent';
import { default as IContentDetail, IContentDetailArgs, IContentSwipeArgs, ContentDetailEvents, ContentDetails } from './IContentDetail';
import * as _ from 'lodash';

export default abstract class ContentBase extends TabBase implements IContent {
    protected abstract details: IContentDetail[];
    protected abstract currentDetail: IContentDetail;
    protected abstract detailWrapperElement: HTMLElement;

    private static readonly PositionStatic: string = 'position: static;';
    private static readonly PositionRelative: string = 'position: relative;';

    public abstract GetIsPermitLeave(): boolean;
    public abstract InitContent(): void;

    public SetDetailToFulscreen(): void {
        this.detailWrapperElement.setAttribute('style', ContentBase.PositionRelative);
        for (let i = 0; i < this.details.length; i++) {
            const detail = this.details[i];
            detail.ToPositionAbsolute();
            (i === 0)
                ? detail.ToVisible()
                : detail.ToHide();
        }
    }
    public SetDetailToColumn(): void {
        this.detailWrapperElement.setAttribute('style', ContentBase.PositionStatic);
        for (let i = 0; i < this.details.length; i++) {
            const detail = this.details[i];
            detail.ToPositionStatic();
            detail.ToVisible();
        }
    }

    protected HideAllDetails(): void {
        for (let i = 0; i < this.details.length; i++) {
            const detail = this.details[i];
            detail.ToHide();
        }
    }

    protected OnSwiped(args: IContentSwipeArgs): void {
        this.$emit(ContentDetailEvents.Swiped, args);
    }

    public async ShowContentDetail(args: IContentDetailArgs): Promise<boolean> {
        let newDetail: IContentDetail = this.GetContentDetail(args.Detail);

        const currentIndex = _.indexOf(this.details, this.currentDetail);
        const newIndex = _.indexOf(this.details, newDetail);

        const promises: Promise<boolean>[] = [];
        if (currentIndex === newIndex) {
            // 新UIと指定UIが同じ
            if (!newDetail.GetIsVisible())
                promises.push(newDetail.SlideInRight());
        } else if (currentIndex <= newIndex) {
            // 新UIが後にある
            this.HideAllDetails();
            promises.push(newDetail.SlideInRight());
            promises.push(this.currentDetail.SlideOutLeft());
        } else {
            // 新UIが前にある
            this.HideAllDetails();
            promises.push(newDetail.SlideInLeft());
            promises.push(this.currentDetail.SlideOutRight());
        }

        await Promise.all(promises);

        this.currentDetail = newDetail;

        return true;
    }

    protected abstract GetContentDetail(detail: ContentDetails): IContentDetail;
}
