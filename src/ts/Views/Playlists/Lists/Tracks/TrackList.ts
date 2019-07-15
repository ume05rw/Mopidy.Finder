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
import Sortable from 'sortablejs/modular/sortable.complete.esm';

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
                    iconClass="fa fa-trash"
                    ref="DeleteListButton"
                    @Clicked="OnClickDeleteList" />
                <slideup-button
                    v-bind:hideOnInit="true"
                    iconClass="fa fa-check"
                    ref="EndEditButton"
                    @Clicked="OnClickEndEdit" />
            </div>
        </div>
        <div class="card-body list-scrollable track-list">
            <ul v-bind:class="listClasses"
                ref="TrackListUl">
                <template v-for="entity in entities">
                <selection-track
                    ref="Items"
                    v-bind:entity="entity"
                    @SelectionChanged="OnSelectionChanged"
                    @DeleteOrdered="OnDeleteRowOrdered" />
                </template>
                <infinite-loading
                    @infinite="OnInfinite"
                    force-use-infinite-wrapper=".list-scrollable.track-list"
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
    private sortable: Sortable = null;

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
    private get DeleteListButton(): SlideupButton {
        return this.$refs.DeleteListButton as SlideupButton;
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
            this.sortable = Sortable.create(this.TrackListUl, {
                animation: 500,
                multiDrag: true,
                selectedClass: 'selected',
                dataIdAttr: 'data-uri',
                onEnd: (ev): void => {
                    this.OnOrderChanged(ev);
                }
            });

            this.DeleteListButton.Show();
            this.EndEditButton.Show().then((): void => {
                this.$forceUpdate();
            });
        });
    }

    private OnClickEndEdit(): void {
        this.sortable.destroy();
        this.sortable = null;

        this.ClearSelection();

        const beforeTracks = this.playlist.Tracks;
        const afterTracks = this.GetEditedTracks();
        const removedTracks = this.removedEntities;
        let orderChanged = false;
        for (let i = 0; i < afterTracks.length; i++) {
            if (afterTracks[i] !== beforeTracks[i]) {
                orderChanged = true;
                break;
            }
        }
        console.log('order changed: ' + orderChanged);
        console.log('removed:');
        console.log(removedTracks);
        // TODO: 保存処理
        // this.playlist.Tracks も更新されるようにする。

        this.playlist.Name = this.TitleInput.value;
        this.playlist.Tracks = afterTracks;

        this.Refresh();

        this.titleInputAnimate
            .RemoveDisplayNone()
            .Execute(Animation.FadeOutDown, Speed.Faster)
            .then((): void => {
                this.titleInputAnimate.SetDisplayNone();
                this.TitleInput.value = '';
                this.titleH3Animate
                    .RemoveDisplayNone()
                    .Execute(Animation.FadeInUp, Speed.Faster);
            });
        this.DeleteListButton.Hide();
        this.EndEditButton.Hide().then((): void => {
            this.listMode = ListMode.Playable;
            this.listClasses = TrackList.ListBaseClasses + this.listMode.toString();
            this.EditButton.Show();
        });
    }

    private ClearSelection(): void {
        _.each(this.Items, (item) => {
            item.Deselect();
            // マルチセレクト有効時はSortableに選択解除を通知する必要がある。
            Sortable.utils.deselect(item.$el as HTMLElement);
        });
    }

    private OnOrderChanged(args: Sortable.SortableEvent): void {
        _.delay((): void => {
            this.ClearSelection();
        }, 500);
    }

    private GetEditedTracks(): Track[] {
        // entitiesをUL要素内の見た目の順序に取得する。
        const result: Track[] = [];

        const enEntities = Libraries.Enumerable.from(this.entities);
        const children = this.TrackListUl.querySelectorAll('li');
        for (let i = 0; i < children.length; i++) {
            const uri = children[i].getAttribute('data-uri');
            const entity = enEntities.firstOrDefault(e => e.Uri == uri);
            if (entity && result.indexOf(entity) <= -1)
                result.push(entity);
        }
        const beforeTracks = this.playlist.Tracks;
        for (let i = 0; i < beforeTracks.length; i++) {
            const track = beforeTracks[i];

            // 表示圏外だったエンティティを追加する。
            if (
                result.indexOf(track) <= -1
                && this.removedEntities.indexOf(track) <= 1
            ) {
                result.push(track);
            }
        }

        return result;
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

    private async OnClickDeleteList(): Promise<boolean> {
        if (this.listMode === ListMode.Playable)
            return;

        const promises: Promise<boolean>[] = [];
        let hasRemovedTrack = false;
        _.each(this.$children, (view) => {
            if (
                view instanceof SelectionTrack
                && view.GetIsSelected()
            ) {
                promises.push(this.DeleteTrack(view));
                hasRemovedTrack = true;
            }
        });

        if (hasRemovedTrack) {
            // どれかトラックが削除されたとき
            await Promise.all(promises);
        } else {
            // 削除トラックが無い(=どの行も選択されていない)とき
            // TODO: プレイリスト全体を削除するか、ダイアログを出す。
        }

        return true;
    }

    private async OnDeleteRowOrdered(args: ITrackDeleteOrderedArgs): Promise<boolean> {
        if (this.listMode === ListMode.Playable)
            return;

        await this.DeleteTrack(args.View);

        return true;
    }

    private async DeleteTrack(row: SelectionTrack): Promise<boolean> {
        if (this.listMode === ListMode.Playable)
            return;

        await row.Delete();

        row.$el.parentElement.removeChild(row.$el);
        _.pull(this.entities, row.Entity);
        this.removedEntities.push(row.Entity);

        return true;
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
