import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import ViewBase from '../../Bases/ViewBase';
import Libraries from '../../../Libraries';
import Vue from 'vue';
import * as _ from 'lodash';
import SelectionItem from '../../Shared/SelectionItem';

Vue.use(InfiniteLoading);

@Component({
    template: `<div class="col-md-3">
    <div id="artistList" class="card">
        <div class="card-header with-border bg-info">
            <h3 class="card-title">Artists</h3>
            <div class="card-tools">
                <button
                    class="btn btn-tool d-inline d-md-none collapse"
                    ref="ButtonCollaple"
                    @click="OnCollapleClick" >
                    <i class="fa fa-minus" />
                </button>
                <button type="button"
                        class="btn btn-tool"
                        @click="OnClickRefresh" >
                    <i class="fa fa-repeat" />
                </button>
            </div>
        </div>
        <div class="card-body list-scrollable">
            <ul class="nav nav-pills h-100 d-flex flex-column flex-nowrap">
                <template v-for="entity in entities">
                <selection-item
                    ref="Items"
                    v-bind:entity="entity"
                    @SelectionChanged="OnSelectionChanged" />
                </template>
                <infinite-loading @infinite="OnInfinite" ref="InfiniteLoading"></infinite-loading>
            </ul>
        </div>
    </div>
</div>`,
    components: {
        'selection-item': SelectionItem
    }
})
export default class ArtistList extends ViewBase {
}
