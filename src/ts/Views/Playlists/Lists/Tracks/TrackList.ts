import * as _ from 'lodash';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../../../Libraries';
import { IPagenatedResult } from '../../../../Models/Bases/StoreBase';
import Playlist from '../../../../Models/Playlists/Playlist';
import PlaylistStore from '../../../../Models/Playlists/PlaylistStore';
import Track from '../../../../Models/Tracks/Track';
import Filterbox from '../../../Shared/Filterboxes/Filterbox';
import { default as SelectionList } from '../../../Shared/SelectionList';
import SlideupButton from '../../../Shared/SlideupButton';
import { default as SelectionTrack, ITrackDeleteOrderedArgs, ITrackSelectionChangedArgs } from './SelectionTrack';
import { default as Animate, Animation, Speed } from '../../../../Utils/Animate';

enum ListMode {
    Playable = 'playable',
    Editable = 'editable'
}

@Component({
    template: `<div class="col-md-9 playlist-track">
    <div class="card">
        <div class="card-header with-border bg-secondary">
            <h3 class="card-title"
                ref="TitleH3">
                Tracks
            </h3>
            <input class="form-control form-control-sm d-none title-input"
                ref="TitleInput" />
            <div class="card-tools form-row">
                <filter-textbox
                    v-bind:placeHolder="'Track?'"
                    ref="Filterbox"
                    @TextUpdated="Refresh()" />
                <slideup-button
                    v-bind:hideOnInit="false"
                    iconClass="fa fa-pencil"
                    ref="EditButton"
                    @Clicked="OnClickEdit" />
                <slideup-button
                    v-bind:hideOnInit="true"
                    iconClass="fa fa-check"
                    ref="EndEditButton"
                    @Clicked="OnClickEndEdit" />
            </div>
        </div>
        <div class="card-body list-scrollable">
            <ul v-bind:class="listClasses"
                ref="TrackListUl">
                <template v-for="entity in entities">
                <selection-track
                    ref="Items"
                    v-bind:entity="entity"
                    @SelectionChanged="OnSelectionChanged"
                    @DeleteOrdered="OnDeleteOrdered" />
                </template>
                <infinite-loading
                    @infinite="OnInfinite"
                    ref="InfiniteLoading" />
            </ul>
        </div>
    </div>
</div>`,
    components: {
        'filter-textbox': Filterbox,
        'slideup-button': SlideupButton,
        'selection-track': SelectionTrack,
        'infinite-loading': InfiniteLoading
    }
})
export default class TrackList extends SelectionList<Track, PlaylistStore> {

    private static readonly PageLength: number = 20;
    private static readonly ListBaseClasses = 'products-list product-list-in-box track-list ';

    protected store: PlaylistStore = new PlaylistStore();
    protected entities: Track[] = [];
    private playlist: Playlist = null;
    private removedEntities: Track[] = [];
    private listMode: ListMode = ListMode.Playable;
    private listClasses: string = TrackList.ListBaseClasses + this.listMode.toString();
    private titleH3Animate: Animate;
    private titleInputAnimate: Animate;

    private get TitleH3(): HTMLHeadingElement {
        return this.$refs.TitleH3 as HTMLHeadingElement;
    }
    private get TitleInput(): HTMLInputElement {
        return this.$refs.TitleInput as HTMLInputElement;
    }
    private get Filterbox(): Filterbox {
        return this.$refs.Filterbox as Filterbox;
    }

    private get EditButton(): SlideupButton {
        return this.$refs.EditButton as SlideupButton;
    }
    private get EndEditButton(): SlideupButton {
        return this.$refs.EndEditButton as SlideupButton;
    }
    private get TrackListUl(): HTMLUListElement {
        return this.$refs.TrackListUl as HTMLUListElement;
    }
    private get Items(): SelectionTrack[] {
        return this.$refs.Items as SelectionTrack[];
    }

    public async Initialize(): Promise<boolean> {
        this.isAutoCollapse = false;
        await super.Initialize();

        this.titleH3Animate = new Animate(this.TitleH3);
        this.titleInputAnimate = new Animate(this.TitleInput);

        return true;
    }

    public async SetPlaylist(playlist: Playlist): Promise<boolean> {
        this.playlist = (playlist)
            ? playlist
            : null;
        this.entities = [];
        this.removedEntities = [];

        for (let i = 0; i < this.playlist.Tracks.length; i++)
            this.playlist.Tracks[i].TlId = null;

        this.Refresh();

        return true;
    }

    private OnClickEdit(): void {
        this.titleH3Animate
            .RemoveDisplayNone()
            .Execute(Animation.FadeOutDown, Speed.Faster)
            .then((): void => {
                this.titleH3Animate.SetDisplayNone();
                this.TitleInput.value = this.playlist.Name;
                this.titleInputAnimate
                    .RemoveDisplayNone()
                    .Execute(Animation.FadeInUp, Speed.Faster);
            });
        this.EditButton.Hide().then((): void => {
            this.listMode = ListMode.Editable;
            this.listClasses = TrackList.ListBaseClasses + this.listMode.toString();
            this.EndEditButton.Show().then((): void => {
                this.$forceUpdate();
            });
        });
    }

    private OnClickEndEdit(): void {
        // TODO: 保存処理

        this.titleInputAnimate
            .RemoveDisplayNone()
            .Execute(Animation.FadeOutDown, Speed.Faster)
            .then((): void => {
                this.titleInputAnimate.SetDisplayNone();
                this.TitleInput.value = '';
                this.titleH3Animate
                    .RemoveDisplayNone()
                    .Execute(Animation.FadeInUp, Speed.Faster);
            })
        this.EndEditButton.Hide().then((): void => {
            _.each(this.Items, (item) => {
                item.Deselect();
            });

            this.listMode = ListMode.Playable;
            this.listClasses = TrackList.ListBaseClasses + this.listMode.toString();
            this.EditButton.Show();
        });
    }

    protected OnSelectionChanged(args: ITrackSelectionChangedArgs): void {

        if (this.listMode === ListMode.Playable) {
            // 再生モード時
            const isAllTracksRegistered = Libraries.Enumerable.from(this.playlist.Tracks)
                .all((e): boolean => e.TlId !== null);

            (isAllTracksRegistered)
                ? this.store.PlayByTlId(args.Entity.TlId)
                : this.store.PlayPlaylist(this.playlist, args.Entity);
        } else if (this.listMode === ListMode.Editable) {
            // 編集モード時

            (args.View.GetIsSelected())
                ? args.View.Deselect()
                : args.View.Select();
        }
    }

    private async OnDeleteOrdered(args: ITrackDeleteOrderedArgs): Promise<boolean> {
        if (this.listMode === ListMode.Playable)
            return;

        await args.View.Deltete();

        args.View.$el.parentElement.removeChild(args.View.$el);
        _.pull(this.entities, args.Entity);
        this.removedEntities.push(args.Entity);

        return;
    }

    /**
     * Vueのイベントハンドラは、実装クラス側にハンドラが無い場合に
     * superクラスの同名メソッドが実行されるが、superクラス上のthisが
     * バインドされずにnullになってしまう。
     * 必ず実装クラス側でハンドルしてsuperクラスに渡すようにする。
     */
    protected async OnInfinite($state: StateChanger): Promise<boolean> {
        return super.OnInfinite($state);
    }
    protected async GetPagenatedList(): Promise<IPagenatedResult<Track>> {
        if (!this.playlist) {
            const result: IPagenatedResult<Track> = {
                ResultLength: 0,
                TotalLength: 0,
                ResultList: [],
                ResultPage: 1
            };

            return result;
        }

        if (!this.playlist.Tracks || this.playlist.Tracks.length <= 0)
            this.playlist.Tracks = await this.store.GetTracksByPlaylist(this.playlist);

        let entities = Libraries.Enumerable.from(this.playlist.Tracks);
        const filterText = this.Filterbox.GetText().toLowerCase();
        if (0 < filterText.length)
            entities = entities
                .where((e): boolean => 0 <= e.LowerName.indexOf(filterText));

        const totalLength = entities.count();
        const pagenated = entities
            .skip((this.Page - 1) * TrackList.PageLength)
            .take(TrackList.PageLength)
            .toArray();

        const result: IPagenatedResult<Track> = {
            TotalLength: totalLength,
            ResultLength: pagenated.length,
            ResultList: pagenated,
            ResultPage: this.Page
        };

        return result;
    }
}
