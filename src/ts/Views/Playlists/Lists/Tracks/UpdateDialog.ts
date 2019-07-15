import { default as ConfirmDialog, ConfirmType } from '../../../Shared/Dialogs/ConfirmDialog';
import Track from '../../../../Models/Tracks/Track';

export default class UpdateDialog extends ConfirmDialog {

    public SetUpdateMessage(
        isOrderChanged: boolean,
        removedTracks: Track[],
        newName: string = null
    ): void {
        const message = 'Update Playlist?';
        const confirmType = (removedTracks && 0 < removedTracks.length)
            ? ConfirmType.Warning
            : ConfirmType.Notice;

        const details: string[] = [];

        if (newName && 0 < newName.length)
            details.push(`Rename to [ ${newName} ]`);

        if (removedTracks && 0 < removedTracks.length) {
            const unit = (removedTracks.length === 1)
                ? 'Track'
                : 'Tracks';
            details.push(`Delete ${removedTracks.length} ${unit}.`);
        }

        if (isOrderChanged === true)
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
