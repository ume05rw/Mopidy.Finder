import Component from 'vue-class-component';
import Libraries from '../../../Libraries';
import ViewBase from '../../Bases/ViewBase';

@Component({
    template: `<div class="modal fade"
    data-backdrop="static"
    data-keyboard="false"
    data-focus="true"
    style="display: none;"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content bg-info">
            <div class="modal-header">
                <h4 class="modal-title">{{ mainMessage }}</h4>
            </div>
            <div class="modal-body">
                <div>
                    <p>{{ currentMessage }}</p>
                </div>
                <div>
                    <div class="progress">
                        <div class="progress-bar bg-success progress-bar-striped"
                            role="progressbar"
                            aria-valuenow="0"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            ref="ProgressBar">
                            <span class="sr-only">{{ progress }}% Complete</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`
})
export default class ProgressDialog extends ViewBase {

    private mainMessage: string = '';
    private currentMessage: string = '';
    private progress: number = 0;
    private modal: JQuery;

    private get ProgressBar(): HTMLDivElement {
        return this.$refs.ProgressBar as HTMLDivElement;
    }

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        this.modal = Libraries.$(this.$el as HTMLElement);

        return true;
    }

    public Show(title: string): void {
        this.mainMessage = title;
        this.progress = 0;
        this.currentMessage = '';
        this.modal.modal('show');
    }

    public SetUpdate(progressPercent: number, message: string = null): void {
        this.progress = progressPercent;
        this.ProgressBar.setAttribute('style', `width: ${this.progress}%;`);
        this.ProgressBar.setAttribute('aria-valuenow', this.progress.toString());
        if (message)
            this.currentMessage = message;
    }

    public Hide(): void {
        this.modal.modal('hide');
    }
}
