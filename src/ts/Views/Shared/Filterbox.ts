import { default as Delay, DelayedOnceExecuter } from '../../Utils/Delay';
import Component from 'vue-class-component';
import ViewBase from '../Bases/ViewBase';
import { Prop } from 'vue-property-decorator';

export const FilterboxEvents = {
    TextUpdated: 'TextUpdated',
    AnimationEnd: 'animationend'
};

@Component({
    template: `<div class="form-inline">
    <input class="form-control form-control-navbar form-control-sm text-filter d-none"
        type="search"
        v-bind:placeholder="placeHolder"
        v-bind:aria-label="placeHolder"
        ref="InputText"
        @input="OnInput"
        @blur="OnBlur"/>
    <button
        class="btn btn-tool d-inline"
        ref="ButtonShow"
        @click="OnClickShow" >
        <i class="fa fa-search" />
    </button>
</div>`
})
export default class Filterbox extends ViewBase {

    private static readonly Classes = {
        DisplayInline: 'd-inline',
        DisplayNone: 'd-none',
        Animated: 'animated',
        In: 'fadeInUp',
        Out: 'fadeOutDown',
        Speed: 'faster'
    };

    @Prop()
    private placeHolder: string;

    private lazyUpdater: DelayedOnceExecuter;

    private get ButtonShow(): HTMLButtonElement {
        return this.$refs.ButtonShow as HTMLButtonElement;
    }
    private get InputText(): HTMLInputElement {
        return this.$refs.InputText as HTMLInputElement;
    }

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        this.InputText.addEventListener(FilterboxEvents.AnimationEnd, (): void => {
            this.PostAnimated(this.InputText);
            if (this.InputText.classList.contains(Filterbox.Classes.DisplayInline))
                this.InputText.focus();
            if (this.InputText.classList.contains(Filterbox.Classes.DisplayNone))
                this.ShowElement(this.ButtonShow);
        });

        this.ButtonShow.addEventListener(FilterboxEvents.AnimationEnd, (): void => {
            this.PostAnimated(this.ButtonShow);
            if (this.ButtonShow.classList.contains(Filterbox.Classes.DisplayNone))
                this.ShowElement(this.InputText);
        });

        this.lazyUpdater = Delay.DelayedOnce((): void => {
            this.$emit('TextUpdated');
        }, 800);

        return true;
    }

    private PostAnimated(elem: HTMLElement): void {
        elem.classList.remove(Filterbox.Classes.Animated);
        elem.classList.remove(Filterbox.Classes.Speed);

        if (elem.classList.contains(Filterbox.Classes.In)) {
            // 表示化
            elem.classList.remove(Filterbox.Classes.In);
        } else if (elem.classList.contains(Filterbox.Classes.Out)) {
            // 非表示化
            elem.classList.remove(Filterbox.Classes.Out);
            elem.classList.remove(Filterbox.Classes.DisplayInline);
            elem.classList.add(Filterbox.Classes.DisplayNone);
        }
    }

    private OnClickShow(): void {
        this.Show();
    }

    private OnClickClear(): void {
        this.InputText.value = '';
        this.Hide();
    }

    private OnInput(): void {
        this.lazyUpdater.Exec();
    }

    private OnBlur(): void {
        if (!this.InputText.value || this.InputText.value.length <= 0)
            this.Hide();
    }

    private ShowElement(elem: HTMLElement): void {
        elem.classList.remove(Filterbox.Classes.DisplayNone);
        elem.classList.add(Filterbox.Classes.DisplayInline);
        elem.classList.add(Filterbox.Classes.In);
        elem.classList.add(Filterbox.Classes.Animated);
        elem.classList.add(Filterbox.Classes.Speed);
    }

    private HideElement(elem: HTMLElement): void {
        elem.classList.add(Filterbox.Classes.Out);
        elem.classList.add(Filterbox.Classes.Animated);
        elem.classList.add(Filterbox.Classes.Speed);
    }

    public Show(): void {
        this.HideElement(this.ButtonShow);
    }

    public Hide(): void {
        this.HideElement(this.InputText);
    }

    public GetText(): string {
        return this.InputText.value;
    }
}
