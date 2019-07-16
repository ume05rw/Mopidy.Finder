import { default as ConfirmDialog, ConfirmType } from '../../../Shared/Dialogs/ConfirmDialog';
import { IUpdate } from '../../../../Models/Playlists/Playlist';

export default class UpdateDialog extends ConfirmDialog {

    public ConfirmUpdate(listUpdate: IUpdate): Promise<boolean> {
        const message = 'Update Playlist?';
        const confirmType = (0 < listUpdate.RemovedTracks.length)
            ? ConfirmType.Warning
            : ConfirmType.Normal;

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
        details.push('This operation cannot be reversed.');
        details.push('');
        details.push('Are you sure?');

        this.SetConfirmType(confirmType);
        this.SetBody(message, details);

        return this.Confirm();
    }

    public ConfirmRollback(): Promise<boolean> {
        this.SetConfirmType(ConfirmType.Normal);
        const message = 'Rollback Playlist?';
        const details: string[] = [
            'Discard all changes.',
            '',
            'Are you sure?'
        ];
        this.SetBody(message, details);

        return this.Confirm();
    }

    public ConfirmDeleteAll(): Promise<boolean> {
        this.SetConfirmType(ConfirmType.Danger);
        const message = 'Delete Playlist?';
        const details: string[] = [
            'Delete all this playlist.',
            'This operation cannot be reversed.',
            '',
            'Are you sure?'
        ];
        this.SetBody(message, details);


        return this.Confirm();
    }
}
