import Vue from 'vue';
import ViewBase from './ViewBase';

export const TabViewEvents = {
    Show: 'Show',
    Shown: 'Shown',
    Hide: 'Hide',
    Hidden: 'Hidden',
}

export interface ITabView extends Vue {
    OnShow(): void;
    OnShown(): void;
    OnHide(): void;
    OnHidden(): void;
}

export default abstract class TabViewBase extends ViewBase implements ITabView {
    public OnShow(): void {
    }
    public OnShown(): void {
    }
    public OnHide(): void {
    }
    public OnHidden(): void {
    }
}
