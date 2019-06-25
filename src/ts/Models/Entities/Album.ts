import * as _ from 'lodash';

export default class Album {
    private _id: string;
    private _name: string;
    private _uri: string;
    private _artistIds: string[];
    private _genreIds: string[];

    public get Id(): string {
        return this._id;
    }
    public get Name(): string {
        return this._name;
    }
    public get Uri(): string {
        return this._uri;
    }
    public get ArtistIds(): string[] {
        return this._artistIds;
    }
    public get GenreIds(): string[] {
        return this._genreIds;
    }

    public constructor(name: string, uri: string) {
        if (!name || name === '')
            throw new Error('name is required.');
        if (!uri || uri === '')
            throw new Error('uri is required.');

        this._id = _.uniqueId('album_');
        this._name = name;
        this._uri = uri;
        this._artistIds = [];
        this._genreIds = [];
    }

    public SetArtistId(artistId: string): void {
        if (!_.has(this._artistIds, artistId))
            this._artistIds.push(artistId);
    }

    public SetGenreId(genreId: string): void {
        if (!_.has(this._genreIds, genreId))
            this._genreIds.push(genreId);
    }
}
