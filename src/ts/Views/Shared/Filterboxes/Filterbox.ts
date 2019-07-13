import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { default as Delay, DelayedOnceExecuter } from '../../../Utils/Delay';
import ViewBase from '../../Bases/ViewBase';
import SlideupButton from '../SlideupButton';
import SearchInput from './SearchInput';

export const FilterboxEvents = {
    TextUpdated: 'TextUpdated',
    AnimationEnd: 'animationend'
};

@Component({
    template: `<div class="form-inline">
    <search-input
        v-bind:placeholder="placeHolder"
        v-bind:aria-label="placeHolder"
        ref="SearchInput"
        @Input="OnInput"
        @Blur="OnBlur"/>
    <slideup-button
        v-bind:hideOnInit="false"
        iconClass="fa fa-search"
        ref="SearchButton"
        @Clicked="OnClick" />
</div>`,
    components: {
        'search-input': SearchInput,
        'slideup-button': SlideupButton
    }
})
export default class Filterbox extends ViewBase {

    @Prop()
    private placeHolder: string;

    private lazyUpdater: DelayedOnceExecuter;

    private get SearchInput(): SearchInput {
        return this.$refs.SearchInput as SearchInput;
    }

    private get SearchButton(): SlideupButton {
        return this.$refs.SearchButton as SlideupButton;
    }


    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        this.lazyUpdater = Delay.DelayedOnce((): void => {
            this.$emit(FilterboxEvents.TextUpdated);
        }, 800);

        return true;
    }

    private async OnClick(): Promise<boolean> {
        return this.Show();
    }

    private OnInput(): void {
        this.lazyUpdater.Exec();
    }

    private OnBlur(): void {
        const value = this.SearchInput.GetValue();
        if (!value || value.length <= 0)
            this.Hide();
    }

    public async Show(): Promise<boolean> {
        await this.SearchButton.Hide();
        await this.SearchInput.Show();
        this.SearchInput.Focus();

        return true;
    }

    public async Hide(): Promise<boolean> {
        await this.SearchInput.Hide();
        await this.SearchButton.Show();

        return true;
    }

    public GetText(): string {
        return this.SearchInput.GetValue();
    }
}
