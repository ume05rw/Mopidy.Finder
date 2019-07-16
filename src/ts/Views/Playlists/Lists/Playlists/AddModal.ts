import Component from 'vue-class-component';
import Libraries from '../../../../Libraries';
import ViewBase from '../../../Bases/ViewBase';
import { ModalEvents } from '../../../Events/BootstrapEvents';
import Playlist from '../../../../Models/Playlists/Playlist';

export const AddModalEvents = {
    AddOrdered: 'AddOrdered'
};

@Component({
    template: `<div class="modal fade"
    style="display: none;"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content bg-info">
            <div class="modal-header">
                <h4 class="modal-title">New Playlist</h4>
                <button type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body needs-validation"
                novalidate
                ref="DivValidatable" >
                <div class="form-group">
                    <label for="new-playlist-name">Playlist Name</label>
                    <div class="input-group">
                        <input type="text"
                            id="new-playlist-name"
                            class="form-control"
                            required
                            placeholder="Name"
                            autocomplete="off"
                            ref="TextName"/>
                        <div class="invalid-feedback text-white"
                            ref="LabelInvalid"><strong>{{ errorMessage }}</strong></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer justify-content-end">
                <button type="button"
                    class="btn btn-outline-light float-right"
                    @click="OnClickAdd">Add</button>
            </div>
        </div>
    </div>
</div>`
})
export default class AddModal extends ViewBase {

    private modal: JQuery;
    private errorMessage: string = '';

    private get DivValidatable(): HTMLDivElement {
        return this.$refs.DivValidatable as HTMLDivElement;
    }

    private get TextName(): HTMLInputElement {
        return this.$refs.TextName as HTMLInputElement;
    }

    private get LabelInvalid(): HTMLDivElement {
        return this.$refs.LabelInvalid as HTMLDivElement;
    }

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        this.modal = Libraries.$(this.$el as HTMLElement);

        this.modal.on(ModalEvents.Shown, (): void => {
            this.TextName.focus();
        });

        return true;
    }

    private OnClickAdd(): void {
        const valid = this.Validate();
        if (!valid) {
            this.DivValidatable.classList.add('was-validated')

            return;
        }

        this.$emit(AddModalEvents.AddOrdered);
    }

    private Validate(): boolean {

        if (
            !this.TextName.value
            || this.TextName.value.length < Playlist.MinNameLength
        ) {
            this.errorMessage = 'name required.';

            return false;
        }

        if (Playlist.MaxNameLength < this.TextName.value.length) {
            this.errorMessage = 'name too long.'

            return false;
        }

        return true;
    }

    public Show(): void {
        if (this.DivValidatable.classList.contains('was-validated'))
            this.DivValidatable.classList.remove('was-validated');

        this.errorMessage = '';
        this.TextName.value = '';
        this.modal.modal('show');
    }

    public Hide(): void {
        this.modal.modal('hide');
    }

    public GetName(): string {
        return this.TextName.value;
    }
}
