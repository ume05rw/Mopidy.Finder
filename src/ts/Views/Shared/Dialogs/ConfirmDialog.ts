import Component from 'vue-class-component';
import Libraries from '../../../Libraries';
import ViewBase from '../../Bases/ViewBase';

export enum ConfirmType {
    Normal = 'bg-info',
    Warning = 'bg-warning',
    Danger = 'bg-danger'
}

@Component({
    template: `<div class="modal fade"
    data-backdrop="static"
    data-keyboard="false"
    data-focus="true"
    style="display: none;"
    aria-hidden="true">
    <div class="modal-dialog">
        <div v-bind:class="modalClasses">
            <div class="modal-header">
                <h4 class="modal-title">{{ mainMessage }}</h4>
            </div>
            <div class="modal-body">
                <p>
                <template v-for="line in detailLines">
                    <span>{{ line }}</span><br/>
                </template>
                </p>
            </div>
            <div class="modal-footer justify-content-between">
                <button type="button"
                    class="btn btn-outline-light"
                    @click="OnClickCancel">Cancel</button>
                <button type="button"
                    class="btn btn-outline-light"
                    @click="OnClickOk">OK</button>
            </div>
        </div>
    </div>
</div>`
})
export default class ConfirmDialog extends ViewBase {

    private static ModalBaseClass: string = 'modal-content';

    private modalClasses: string = `${ConfirmDialog.ModalBaseClass} ${ConfirmType.Normal.toString()}`;
    private mainMessage: string = '';
    private detailLines: string[] = [];
    private resolver: (result: boolean) => void = null;

    private OnClickOk(): void {
        this.Resolve(true);
    }

    private OnClickCancel(): void {
        this.Resolve(false);
    }

    private Resolve(result: boolean): void {
        if (this.resolver) {
            this.resolver(result);
        }
        this.resolver = null;
        Libraries.Modal.Hide(this);
    }

    public SetConfirmType(confirmType: ConfirmType): void {
        this.modalClasses = `${ConfirmDialog.ModalBaseClass} ${confirmType.toString()}`;
    }

    public SetBody(mainMessage: string, detailLines: string[]): void {
        this.mainMessage = mainMessage;
        if (detailLines && 0 < detailLines.length)
            this.detailLines = detailLines;

        this.$forceUpdate();
    }

    public Confirm(): Promise<boolean> {
        return new Promise((resolve: (value: boolean) => void): void => {
            Libraries.Modal.Show(this);
            this.resolver = resolve;
        });
    }
}
