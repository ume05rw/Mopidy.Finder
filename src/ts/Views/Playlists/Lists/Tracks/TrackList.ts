import * as _ from 'lodash';
import Sortable from 'sortablejs/modular/sortable.complete.esm';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../../../Libraries';
import { IPagenatedResult } from '../../../../Models/Bases/StoreBase';
import { default as Playlist, IUpdate } from '../../../../Models/Playlists/Playlist';
import PlaylistStore from '../../../../Models/Playlists/PlaylistStore';
import Track from '../../../../Models/Tracks/Track';
import { Animation, default as Animate, Speed } from '../../../../Utils/Animate';
import Delay from '../../../../Utils/Delay';
import { Contents } from '../../../Bases/IContent';
import { ContentDetailEvents, ContentDetails, IContentSwipeArgs, SwipeDirection } from '../../../Bases/IContentDetail';
import { default as SelectionListBase, SelectionEvents } from '../../../Bases/SelectionListBase';
import { SwipeEvents } from '../../../Events/HammerEvents';
import Filterbox from '../../../Shared/Filterboxes/Filterbox';
import SlideupButton from '../../../Shared/SlideupButton';
import { default as SelectionTrack, ITrackDeleteOrderedArgs, ITrackSelectionChangedArgs } from './SelectionTrack';
import UpdateDialog from './UpdateDialog';

export const TrackListEvents = {
    PlaylistDeleted: 'PlaylistDeleted',
    PlaylistUpdated: 'PlaylistUpdated'
};

enum ListMode {
    Playable = 'playable',
    Editable = 'editable'
}

@Component({
    template: `<div class="col-lg-9 playlist-track">
    <div class="card">
        <div class="card-header with-border bg-warning">
            <h3 class="card-title"
                ref="TitleH3">
                <i class="fa fa-music" />
                Playlist Tracks
            </h3>
            <input type="text" class="form-control form-control-sm d-none title-input"
                maxlength="40"
                ref="TitleInput"
                @input="OnInputTitle"/>
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
                    ref="HeaderDeleteButton"
                    @Clicked="OnClickHeaderDelete" />
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
        <div class="card-body listbox">
            <div class="outer-scrollbox">
                <div class="inner-scrollbox playlisttrack-list">
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
                            force-use-infinite-wrapper=".inner-scrollbox.playlisttrack-list"
                            ref="InfiniteLoading" />
                    </ul>
                </div>
            </div>
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
export default class TrackList extends SelectionListBase<Track, PlaylistStore> {

    protected readonly tabId: string = 'subtab-playlisttracks';
    protected readonly linkId: string = 'nav-playlisttracks';
    private static readonly PageLength: number = 20;
    private static readonly ListBaseClasses = 'products-list product-list-in-box ';

    protected store: PlaylistStore = new PlaylistStore();
    protected entities: Track[] = [];
    private playlist: Playlist = null;
    private removedEntities: Track[] = [];
    private listMode: ListMode = ListMode.Playable;
    private listClasses: string = TrackList.ListBaseClasses + this.listMode.toString();
    private titleH3Animate: Animate;
    private titleInputAnimate: Animate;
    private sortable: Sortable = null;
    private swipeDetector: HammerManager;

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
    private get HeaderDeleteButton(): SlideupButton {
        return this.$refs.HeaderDeleteButton as SlideupButton;
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
        super.Initialize();

        this.swipeDetector = new Libraries.Hammer(this.$el as HTMLElement);
        this.swipeDetector.get('swipe').set({
            direction: Libraries.Hammer.DIRECTION_HORIZONTAL
        });
        this.swipeDetector.on(SwipeEvents.Left, (): void => {
            const args: IContentSwipeArgs = {
                Content: Contents.Finder,
                ContentDetail: null,
                Direction: SwipeDirection.Left
            };
            this.$emit(ContentDetailEvents.Swiped, args);
        });

        this.swipeDetector.on(SwipeEvents.Right, (): void => {
            const args: IContentSwipeArgs = {
                Content: Contents.Finder,
                ContentDetail: ContentDetails.Playlists,
                Direction: SwipeDirection.Right
            };
            this.$emit(ContentDetailEvents.Swiped, args);
        });

        // ※$onの中ではプロパティ定義が参照出来ないらしい。
        // ※ハンドラメソッドをthisバインドしてもダメだった。
        // ※やむなく、$refsを直接キャストする。
        this.$on(SelectionEvents.ListUpdated, async (): Promise<boolean> => {
            await Delay.Wait(500);

            const items = this.$refs.Items as SelectionTrack[];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (!item.GetIsInitialized())
                    item.Initialize();                
            }

            return true;
        });

        this.titleH3Animate = new Animate(this.TitleH3);
        this.titleInputAnimate = new Animate(this.TitleInput);

        return true;
    }

    public GetIsSavedPlaylistChanges(): boolean {
        if (this.listMode === ListMode.Playable)
            return true;

        return !(this.GetUpdate()).HasUpdate;
    }

    public async SetPlaylist(playlist: Playlist): Promise<boolean> {
        if (this.listMode !== ListMode.Playable)
            await this.GoBackToPlayer();

        this.playlist = (playlist)
            ? playlist
            : null;
        this.entities = [];
        this.removedEntities = [];

        if (this.playlist && this.playlist.Tracks) {
            for (let i = 0; i < this.playlist.Tracks.length; i++)
                this.playlist.Tracks[i].TlId = null;
        }

        this.Refresh();

        return true;
    }

    /**
     * 非表示時にInfiniteLoadingが反応しない現象への対策。
     */
    public LoadIfEmpty(): void {
        if (!this.entities || this.entities.length <= 0)
            this.Refresh();
    }

    // #region "Events"

    private OnInputTitle(): void {
        if (this.listMode === ListMode.Playable)
            return;

        this.ShowUndoIfHidden();
    }

    private OnClickEdit(): void {
        this.GoIntoEditor();
    }

    private async OnClickHeaderDelete(): Promise<boolean> {
        //console.log('TrackList.OnClickDeleteList');
        const promises: Promise<boolean>[] = [];
        let hasRemovedTrack = false;
        for (let i = 0; i < this.Items.length; i++) {
            const item = this.Items[i];
            if (item.GetIsSelected()) {
                promises.push(this.DeleteTrack(item));
                hasRemovedTrack = true;
            }
        }

        if (hasRemovedTrack) {
            // どれかトラックが削除されたとき
            await Promise.all(promises);
            await this.SetSortable();
        } else {
            // 削除トラックが無い(=どの行も選択されていない)とき
            // プレイリスト自体を削除する。
            await this.TryDelete();
        }

        return true;
    }

    private async OnClickUndoButton(): Promise<boolean> {
        const isRollback = await this.UpdateDialog.ConfirmRollback();
        if (isRollback) {
            this.removedEntities = [];
            await this.GoBackToPlayer();
        }

        return true;
    }

    private OnClickEndEdit(): void {
        this.TryUpdate();
    }

    protected async OnSelectionChanged(args: ITrackSelectionChangedArgs): Promise<boolean> {
        if (this.listMode === ListMode.Playable) {
            // 再生モード時
            const isAllTracksRegistered = Libraries.Enumerable.from(this.playlist.Tracks)
                .all((e): boolean => e.TlId !== null);

            // トラックリスト登録状況で再生方法を変える。
            const response = (isAllTracksRegistered)
                ? await this.store.PlayByTlId(args.Entity.TlId)
                : await this.store.PlayPlaylist(this.playlist, args.Entity);

            (response)
                ? Libraries.ShowToast.Success(`Track [ ${args.Entity.Name} ] Started!`)
                : Libraries.ShowToast.Error('Track Order Failed...');

        } else if (this.listMode === ListMode.Editable) {
            // 編集モード時
            (args.View.GetIsSelected())
                ? args.View.Deselect()
                : args.View.Select();
        }

        return true;
    }

    private async OnDeleteRowOrdered(args: ITrackDeleteOrderedArgs): Promise<boolean> {
        //console.log('TrackList.OnDeleteRowOrdered');
        await this.DeleteTrack(args.View);
        this.SetSortable();

        return true;
    }

    private async OnOrderChanged(): Promise<boolean> {
        await Delay.Wait(500);
        this.ClearSelection();
        this.ShowUndoIfHidden();

        return true;
    }

    // #endregion

    // #region "Edit"

    private async GoIntoEditor(): Promise<boolean> {
        // タイトル・編集開始ボタン非表示化
        await Promise.all([
            this.Filterbox.Hide(),
            this.EditButton.Hide(),
            this.titleH3Animate.Execute(Animation.FadeOutDown, Speed.Faster),
        ]);
        
        // 内部的モード切替
        this.TitleInput.value = this.playlist.Name;
        this.listMode = ListMode.Editable;
        this.listClasses = TrackList.ListBaseClasses + this.listMode.toString();

        // 編集操作ボタン類の表示化
        await Promise.all([
            this.titleInputAnimate.Execute(Animation.FadeInUp, Speed.Faster),
            this.HeaderDeleteButton.Show(),
            this.EndEditButton.Show()
        ]);

        // 編集操作ボタン類表示化後
        this.$forceUpdate();
        this.$nextTick((): void => {
            this.SetSortable();
        });

        return true;
    }

    private async GoBackToPlayer(): Promise<boolean> {
        this.ClearSelection();
        this.DisposeSortable();

        // 編集操作ボタン類非表示化
        const promises: Promise<boolean>[] = [
            this.titleInputAnimate.Execute(Animation.FadeOutDown, Speed.Faster),
            this.HeaderDeleteButton.Hide(),
            this.EndEditButton.Hide()
        ];
        if (this.UndoButton.GetIsVisible())
            promises.push(this.UndoButton.Hide());

        await Promise.all(promises);

        // 内部的モード切替
        this.listMode = ListMode.Playable;
        this.listClasses = TrackList.ListBaseClasses + this.listMode.toString();
        this.TitleInput.value = '';

        // タイトル・編集開始ボタン表示化
        await Promise.all([
            this.titleH3Animate.Execute(Animation.FadeInUp, Speed.Faster),
            this.EditButton.Show(),
            this.Filterbox.Show()
        ]);

        // リスト再描画
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

    private ShowUndoIfHidden(): void {
        if (!this.UndoButton.GetIsVisible())
            this.UndoButton.Show();
    }

    private ClearSelection(): void {
        for (let i = 0; i < this.Items.length; i++)
            this.Items[i].Reset();
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

    // #endregion

    // #region "Register"

    private async TryUpdate(): Promise<boolean> {
        const update = this.GetUpdate();

        if (!this.Validate(update))
            return false;

        if (update.HasUpdate) {
            // 何か変更があるとき
            if ((await this.UpdateDialog.ConfirmUpdate(update)) === true) {
                // 更新許可OK
                if ((await this.Update(update)) === true) {
                    Libraries.ShowToast.Success('Playlist Updated!');
                    this.GoBackToPlayer();
                } else {
                    Libraries.ShowToast.Error('Playlist Update Failed...');
                    // そのまま編集モードを維持
                }
            } else {
                // 更新許可NG
                // そのまま編集モードを維持
            }
        } else {
            // 何も変更が無いとき
            // 更新登録せず再生モードへ移行
            this.GoBackToPlayer();
        }

        return true;
    }

    private GetUpdate(): IUpdate {
        const removedTracks = (this.removedEntities && 0 < this.removedEntities.length)
            ? this.removedEntities
            : [];
        const updatedTracks = this.GetEditedTracks();
        const isOrderChanged = this.GetIsOrderChanged(updatedTracks);
        const isNameChanged = (this.playlist.Name !== this.TitleInput.value);
        const hasUpdate = (isOrderChanged !== false)
            || (0 < removedTracks.length)
            || (isNameChanged !== false);

        const result: IUpdate = {
            HasUpdate: hasUpdate,
            UpdatedTracks: updatedTracks,
            RemovedTracks: removedTracks,
            IsOrderChanged: isOrderChanged,
            IsNameChanged: isNameChanged,
            NewName: (this.playlist.Name !== this.TitleInput.value)
                ? this.TitleInput.value
                : null
        };

        return result;
    }

    private GetEditedTracks(): Track[] {
        // entitiesをUL要素内の見た目の順序に取得する。
        const result: Track[] = [];

        const enEntities = Libraries.Enumerable.from(this.entities);
        const children = this.TrackListUl.querySelectorAll('li');
        for (let i = 0; i < children.length; i++) {
            const row = children[i];
            const uri = row.getAttribute('data-uri');
            const entity = enEntities.firstOrDefault((e): boolean => e.Uri == uri);
            if (entity && result.indexOf(entity) <= -1)
                result.push(entity);
        }

        const enResult = Libraries.Enumerable.from(result);
        const enRemoved = Libraries.Enumerable.from(this.removedEntities);

        for (let i = 0; i < this.playlist.Tracks.length; i++) {
            const track = this.playlist.Tracks[i];

            // 表示圏外だったエンティティを追加する。
            if (
                enResult.all((e): boolean => e.Uri !== track.Uri)
                && enRemoved.all((e): boolean => e.Uri !== track.Uri)
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

    private Validate(update: IUpdate): boolean {
        if (
            update.IsNameChanged !== false
            && (
                !update.NewName
                || update.NewName.length < Playlist.MinNameLength
            )
        ) {
            Libraries.ShowToast.Warning('Name required.');
            this.SetTitleValidationBorder(false);
            this.TitleInput.focus();

            return false;
        }

        if (
            update.IsNameChanged !== false
            && Playlist.MaxNameLength < update.NewName.length
        ) {
            Libraries.ShowToast.Warning('Name too long.');
            this.SetTitleValidationBorder(false);
            this.TitleInput.focus();

            return false;
        }

        this.SetTitleValidationBorder(true);

        return true;
    }

    private SetTitleValidationBorder(isValid: boolean): void {
        const classes = this.TitleInput.classList;
        if (
            isValid === true
            && classes.contains('is-invalid')
        ) {
            classes.remove('is-invalid');
        }

        if (
            isValid !== true
            && !classes.contains('is-invalid')
        ) {
            classes.add('is-invalid');
        }
    }

    private async Update(update: IUpdate): Promise<boolean> {
        // TODO: 保存処理
        // this.playlist.Tracks も更新されるようにする。

        if (update.IsNameChanged)
            this.playlist.Name = update.NewName;

        if (update.IsOrderChanged || 0 < update.RemovedTracks.length)
            this.playlist.Tracks = update.UpdatedTracks;

        const result = await this.store.UpdatePlayllist(this.playlist);

        if (result === true) {
            this.$emit(TrackListEvents.PlaylistUpdated);
        }

        return result;
    }

    private async TryDelete(): Promise<boolean> {
        if ((await this.UpdateDialog.ConfirmDeleteAll()) === true) {
            const result = await this.store.DeletePlaylist(this.playlist);
            if (result === true) {
                Libraries.ShowToast.Success('Deleted!');
                this.playlist = null;
                this.removedEntities = [];
                this.$emit(TrackListEvents.PlaylistDeleted);
                await this.GoBackToPlayer();
            } else {
                Libraries.ShowToast.Error('Delete Failed...');
            }
        }

        return true;
    }

    // #endregion

    // #region "InfiniteLoading"
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
            await this.store.SetPlaylistTracks(this.playlist);

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
    // #endregion
}
