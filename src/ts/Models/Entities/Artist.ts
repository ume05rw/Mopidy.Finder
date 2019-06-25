import * as _ from 'lodash';

export default class Artist {
    private _id: string;
    private _name: string;
    private _uri: string;

    public get Id(): string {
        return this._id;
    }
    public get Name(): string {
        return this._name;
    }
    public get Uri(): string {
        return this._uri;
    }

    public constructor(name: string, uri: string) {
        if (!name || name === '')
            throw new Error('name is required.');
        if (!uri || uri === '')
            throw new Error('uri is required.');

        this._id = _.uniqueId('artist_');
        this._name = name;
        this._uri = uri;
    }
}
