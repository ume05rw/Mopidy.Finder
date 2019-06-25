export default class GenreAlbum {
    private _genreId: string;
    private _albumId: string;

    public get GenreId(): string {
        return this._genreId;
    }
    public get AlbumId(): string {
        return this._albumId;
    }

    public constructor(genreId: string, albumId: string) {
        this._genreId = genreId;
        this._albumId = albumId;
    }
}
