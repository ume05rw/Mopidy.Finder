import ViewBase from '../Bases/ViewBase';
import Component from 'vue-class-component';
import GenreList from './GenreList';

@Component({
    template: `<section class="content h-100">
    <div class="row">
        <genre-list ref="GenreList" />
    </div>
</section>`,
    components: {
        'genre-list': GenreList
    }
})
export default class Finder extends ViewBase {

    private get GenreList(): GenreList {
        return this.$refs.GenreList as GenreList;
    }
}
