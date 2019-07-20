import Vue from 'vue';
import ViewBase from './ViewBase';

export const TabEvents = {
    Show: 'Show',
    Shown: 'Shown',
    Hide: 'Hide',
    Hidden: 'Hidden',
}

export interface ITab extends Vue {
    OnShow(): void;
    OnShown(): void;
    OnHide(): void;
    OnHidden(): void;
}

export default abstract class TabBase extends ViewBase implements ITab {
    public OnShow(): void {
    }
    public OnShown(): void {
    }
    public OnHide(): void {
    }
    public OnHidden(): void {
    }
}
