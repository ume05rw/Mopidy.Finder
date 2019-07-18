import Component from 'vue-class-component';
import ContentViewBase from '../Bases/ContentViewBase';

@Component({
    template: `<section class="content h-100 tab-pane fade"
                        id="tab-settings"
                        role="tabpanel"
                        aria-labelledby="settings-tab">
</section>`,
    components: {
    }
})
export default class Settings extends ContentViewBase {

    // #region "IContentView"
    public GetIsPermitLeave(): boolean {
        // DBリフレッシュ中はページ移動NGにする。
        return true;
    }
    public InitContent(): void {
    }
    // #endregion
}
