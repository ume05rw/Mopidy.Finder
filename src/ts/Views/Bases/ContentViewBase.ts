import { default as TabViewBase, ITabView } from './TabViewBase';

export interface IContentView extends ITabView {
    GetIsPermitLeave(): boolean;
    InitContent(): void;
}

export default abstract class ContentViewBase extends TabViewBase implements IContentView {
    public abstract GetIsPermitLeave(): boolean;
    public abstract InitContent(): void;
}
