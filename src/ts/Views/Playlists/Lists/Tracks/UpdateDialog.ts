import { default as ConfirmDialog, ConfirmType } from '../../../Shared/Dialogs/ConfirmDialog';
import { IUpdate } from '../../../../Models/Playlists/Playlist';

export default class UpdateDialog extends ConfirmDialog {

    public SetUpdateMessage(listUpdate: IUpdate): void {
        const message = 'Update Playlist?';
        const confirmType = (0 < listUpdate.RemovedTracks.length)
            ? ConfirmType.Warning
            : ConfirmType.Notice;

        const details: string[] = [];

        if (listUpdate.IsNameChanged)
            details.push(`Rename to [ ${listUpdate.NewName} ]`);

        if (0 < listUpdate.RemovedTracks.length) {
            const unit = (listUpdate.RemovedTracks.length === 1)
                ? 'Track'
                : 'Tracks';
            details.push(`Delete ${listUpdate.RemovedTracks.length} ${unit}.`);
        }

        if (listUpdate.IsOrderChanged !== false)
            details.push('Change Track Order.');

        details.push('');
        details.push('Are you sure?');

        this.SetConfirmType(confirmType);
        this.SetBody(message, details);
    }

    public SetRollbackMessage(): void {
        this.SetConfirmType(ConfirmType.Notice);
        const message = 'Rollback Playlist?';
        const details: string[] = [
            'Discard all changes.',
            '',
            'Are you sure?'
        ];
        this.SetBody(message, details);
    }
}
