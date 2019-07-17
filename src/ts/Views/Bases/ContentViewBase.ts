import ViewBase from './ViewBase';
import Vue from 'vue';

export interface IContentView extends Vue {
    GetIsPermitLeave(): boolean;
}

export default abstract class ContentViewBase extends ViewBase implements IContentView {
    public abstract GetIsPermitLeave(): boolean;
}
