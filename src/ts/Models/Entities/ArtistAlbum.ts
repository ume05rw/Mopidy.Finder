export default class ArtistAlbum {
    private _artistId: string;
    private _albumId: string;

    public get ArtistId(): string {
        return this._artistId;
    }
    public get AlbumId(): string {
        return this._albumId;
    }

    public constructor(artistId: string, albumId: string) {
        this._artistId = artistId;
        this._albumId = albumId;
    }
}
