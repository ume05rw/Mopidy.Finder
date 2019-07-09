import Component from 'vue-class-component';
import ViewBase from '../Bases/ViewBase';

@Component({
    template: `<section class="content h-100 tab-pane fade"
                        id="tab-settings"
                        role="tabpanel"
                        aria-labelledby="settings-tab">
</section>`,
    components: {
    }
})
export default class Settings extends ViewBase {

}
