import ViewBase from './ViewBase';
import Vue from 'vue';
import Libraries from '../../Libraries';
import { ModalEvents } from '../Events/BootstrapEvents';

export interface IContentView extends Vue {
    GetIsPermitLeave(): boolean;
}

export default abstract class ContentViewBase extends ViewBase implements IContentView {
    public abstract GetIsPermitLeave(): boolean;

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        const elem = Libraries.$(this.$el as HTMLElement);
        elem.on(ModalEvents.Show, (): void => {
            this.OnShow();
        });
        elem.on(ModalEvents.Shown, (): void => {
            this.OnShown();
        });
        elem.on(ModalEvents.Hide, (): void => {
            this.OnHide();
        });
        elem.on(ModalEvents.Hidden, (): void => {
            this.OnHidden();
        });

        return true;
    }

    protected async OnShow(): Promise<boolean> {
        return true;
    }

    protected async OnShown(): Promise<boolean> {
        return true;
    }

    protected async OnHide(): Promise<boolean> {
        return true;
    }

    protected async OnHidden(): Promise<boolean> {
        return true;
    }
}
