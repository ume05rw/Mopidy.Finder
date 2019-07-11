import Component from 'vue-class-component';
import ViewBase from '../Bases/ViewBase';

@Component({
    template: `<section class="content h-100 tab-pane fade"
                        id="tab-playlists"
                        role="tabpanel"
                        aria-labelledby="playlists-tab">
    <div class="row">
    </div>
</section>`,
    components: {
    }
})
export default class Playlists extends ViewBase {

}
