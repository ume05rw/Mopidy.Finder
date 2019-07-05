import Album from '../Albums/Album';
import Artist from '../Artists/Artist';
import Track from '../Tracks/Track'
import ISelectionItem from '../Bases/ISelectionItem';

export default class AlbumTracks implements ISelectionItem {
    public Album: Album;
    public Artist: Artist;
    public Tracks: Track[];

    public get Id(): number {
        return this.Album.Id;
    }
    public get Name(): string {
        return this.Album.Name;
    }
    public get LowerName(): string {
        return this.Album.LowerName;
    }
    public get Uri(): string {
        return this.Album.Uri;
    }
}
