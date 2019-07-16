import * as _ from 'lodash';
import Sortable from 'sortablejs/modular/sortable.complete.esm';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../../../Libraries';
import { IPagenatedResult } from '../../../../Models/Bases/StoreBase';
import Playlist from '../../../../Models/Playlists/Playlist';
import PlaylistStore from '../../../../Models/Playlists/PlaylistStore';
import Track from '../../../../Models/Tracks/Track';
import { Animation, default as Animate, Speed } from '../../../../Utils/Animate';
import Delay from '../../../../Utils/Delay';
import Filterbox from '../../../Shared/Filterboxes/Filterbox';
import { default as SelectionList, SelectionEvents } from '../../../Shared/SelectionList';
import SlideupButton from '../../../Shared/SlideupButton';
import { default as SelectionTrack, ITrackDeleteOrderedArgs, ITrackSelectionChangedArgs } from './SelectionTrack';
import UpdateDialog from './UpdateDialog';

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
                    tooltip="Edit"
                    ref="EditButton"
                    @Clicked="OnClickEdit" />
                <slideup-button
                    v-bind:hideOnInit="true"
                    iconClass="fa fa-trash"
                    tooltip="Delete"
                    ref="DeleteListButton"
                    @Clicked="OnClickDeleteList" />
                <slideup-button
                    v-bind:hideOnInit="true"
                    iconClass="fa fa-undo"
                    tooltip="Rollback"
                    ref="UndoButton"
                    @Clicked="OnClickUndoButton" />
                <slideup-button
                    v-bind:hideOnInit="true"
                    iconClass="fa fa-check"
                    tooltip="Update"
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
    <update-dialog
        ref="UpdateDialog" />
</div>`,
    components: {
        'filter-textbox': Filterbox,
        'slideup-button': SlideupButton,
        'selection-track': SelectionTrack,
        'infinite-loading': InfiniteLoading,
        'update-dialog': UpdateDialog
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
    private get UndoButton(): SlideupButton {
        return this.$refs.UndoButton as SlideupButton;
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
    private get UpdateDialog(): UpdateDialog {
        return this.$refs.UpdateDialog as UpdateDialog;
    }

    public async Initialize(): Promise<boolean> {
        this.isAutoCollapse = false;
        await super.Initialize();

        this.$on(SelectionEvents.ListUpdated, async (): Promise<boolean> => {
            await Delay.Wait(500);

            for (let i = 0; i < this.Items.length; i++) {
                const item = this.Items[i];
                if (!item.GetIsInitialized())
                    item.Initialize();                
            }

            return true;
        });

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

    private async SetSortable(): Promise<boolean> {
        this.DisposeSortable();

        await Delay.Wait(10);

        this.sortable = Sortable.create(this.TrackListUl, {
            animation: 500,
            multiDrag: true,
            selectedClass: 'selected',
            dataIdAttr: 'data-uri',
            onEnd: (): void => {
                this.OnOrderChanged();
            }
        });

        return true;
    }

    private DisposeSortable(): void {
        if (this.sortable !== null) {
            try {
                this.sortable.destroy();
            } catch (ex) {
                // 握りつぶす。
            }
        }
        this.sortable = null;
    }

    private OnClickEdit(): void {
        this.GoIntoEditor();
    }

    private async OnClickEndEdit(): Promise<boolean> {
        this.ClearSelection();
        this.DisposeSortable();
        
        const updatedTracks = this.GetEditedTracks();
        const isOrderChanged = this.GetIsOrderChanged(updatedTracks);
        const removedTracks = this.removedEntities;
        const newName = (this.playlist.Name !== this.TitleInput.value)
            ? this.TitleInput.value
            : null;

        if (
            this.playlist.Name !== this.TitleInput.value
            && (
                !this.TitleInput.value
                || this.TitleInput.value.length <= 0
            )
        ) {
            // TODO: AlertToastを出す。'Name required.'
            this.TitleInput.focus();

            return false;
        }

        let isUpdate = false;
        if (
            isOrderChanged
            || 0 < removedTracks.length
            || (newName && 1 <= newName.length)
        ) {
            // 何か変更があるとき
            this.UpdateDialog.SetUpdateMessage(isOrderChanged, removedTracks, newName);
            isUpdate = await this.UpdateDialog.Confirm();
        }

        if (isUpdate === true)
            await this.Update(updatedTracks);

        this.GoBackToPlayer();

        return true;
    }

    private GetEditedTracks(): Track[] {
        // entitiesをUL要素内の見た目の順序に取得する。
        const result: Track[] = [];

        const enEntities = Libraries.Enumerable.from(this.entities);
        const children = this.TrackListUl.querySelectorAll('li');
        for (let i = 0; i < children.length; i++) {
            const uri = children[i].getAttribute('data-uri');
            const entity = enEntities.firstOrDefault((e): boolean => e.Uri == uri);
            if (entity && result.indexOf(entity) <= -1)
                result.push(entity);
        }

        for (let i = 0; i < this.playlist.Tracks.length; i++) {
            const track = this.playlist.Tracks[i];

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

    private GetIsOrderChanged(updatedTracks: Track[]): boolean {
        const beforeTracks = this.playlist.Tracks;
        let result = false;
        for (let i = 0; i < updatedTracks.length; i++) {
            if (updatedTracks[i] !== beforeTracks[i]) {
                result = true;
                break;
            }
        }

        return result;
    }

    private async Update(newTracks: Track[]): Promise<boolean> {

        // TODO: 保存処理
        // this.playlist.Tracks も更新されるようにする。

        this.playlist.Name = this.TitleInput.value;
        this.playlist.Tracks = newTracks;

        return true;
    }

    private async GoIntoEditor(): Promise<boolean> {
        // タイトル・編集開始ボタン非表示化
        this.titleH3Animate
            .RemoveDisplayNone()
            .Execute(Animation.FadeOutDown, Speed.Faster)
            .then((): void => {
                this.titleH3Animate.SetDisplayNone();
            });
        await this.EditButton.Hide();

        // 内部的モード切替
        this.TitleInput.value = this.playlist.Name;
        this.listMode = ListMode.Editable;
        this.listClasses = TrackList.ListBaseClasses + this.listMode.toString();

        // 編集操作ボタン類の表示化
        this.titleInputAnimate
            .RemoveDisplayNone()
            .Execute(Animation.FadeInUp, Speed.Faster);
        this.DeleteListButton.Show();
        await this.EndEditButton.Show();

        // 編集操作ボタン類表示化後
        this.$forceUpdate();
        this.$nextTick((): void => {
            this.SetSortable();
        });

        return true;
    }

    private async GoBackToPlayer(): Promise<boolean> {
        // 編集操作ボタン類非表示化
        this.titleInputAnimate
            .RemoveDisplayNone()
            .Execute(Animation.FadeOutDown, Speed.Faster)
            .then((): void => {
                this.titleInputAnimate.SetDisplayNone();
            });
        this.DeleteListButton.Hide();
        await this.EndEditButton.Hide();

        // 内部的モード切替
        this.TitleInput.value = '';
        this.listMode = ListMode.Playable;
        this.listClasses = TrackList.ListBaseClasses + this.listMode.toString();

        // タイトル・編集開始ボタン表示化
        if (this.UndoButton.GetIsVisible())
            this.UndoButton.Hide();
        this.titleH3Animate
            .RemoveDisplayNone()
            .Execute(Animation.FadeInUp, Speed.Faster);
        await this.EditButton.Show();

        // リスト再描画
        this.Refresh();

        return true;
    }

    private ShowUndoIfHidden(): void {
        if (!this.UndoButton.GetIsVisible())
            this.UndoButton.Show();
    }

    private ClearSelection(): void {
        _.each(this.Items, (item): void => {
            item.Reset();
            // マルチセレクト有効時はSortableに選択解除を通知する必要がある。
            if (this.sortable) {
                try {
                    Sortable.utils.deselect(item.$el as HTMLElement);
                } catch (ex) {
                    // 握りつぶす。
                }
            }
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

    private OnOrderChanged(): void {
        _.delay((): void => {
            this.ClearSelection();
            this.ShowUndoIfHidden();
        }, 500);
    }

    private async OnClickDeleteList(): Promise<boolean> {
        //console.log('TrackList.OnClickDeleteList');
        if (this.listMode === ListMode.Playable)
            return;

        const promises: Promise<boolean>[] = [];
        let hasRemovedTrack = false;
        _.each(this.$children, (view): void => {
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
            await this.SetSortable();
        } else {
            // 削除トラックが無い(=どの行も選択されていない)とき
            // TODO: プレイリスト全体を削除するか、ダイアログを出す。
        }

        return true;
    }

    private async OnClickUndoButton(): Promise<boolean> {
        this.UpdateDialog.SetRollbackMessage();
        const isRollback = await this.UpdateDialog.Confirm();

        if (isRollback) {
            this.removedEntities = [];
            await this.GoBackToPlayer();
        }

        return true;
    }

    private async OnDeleteRowOrdered(args: ITrackDeleteOrderedArgs): Promise<boolean> {
        //console.log('TrackList.OnDeleteRowOrdered');
        if (this.listMode === ListMode.Playable)
            return;

        await this.DeleteTrack(args.View);

        this.SetSortable();

        return true;
    }

    private async DeleteTrack(row: SelectionTrack): Promise<boolean> {
        //console.log('TrackList.DeleteTrack');
        if (this.listMode === ListMode.Playable)
            return;

        await row.DeleteTrack();
        
        row.$el.parentElement.removeChild(row.$el);
        _.pull(this.$children, row);
        _.pull(this.entities, row.Entity);
        this.removedEntities.push(row.Entity);
        row.$destroy();

        this.ShowUndoIfHidden();

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
