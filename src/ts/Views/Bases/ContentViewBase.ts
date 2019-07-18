import Vue from 'vue';
import Libraries from '../../Libraries';
import { TabEvents } from '../Events/BootstrapEvents';
import ViewBase from './ViewBase';

export interface IContentView extends Vue {
    GetIsPermitLeave(): boolean;
    InitContent(): void;
}

export default abstract class ContentViewBase extends ViewBase implements IContentView {
    public abstract GetIsPermitLeave(): boolean;
    public abstract InitContent(): void;
}
