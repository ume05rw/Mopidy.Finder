import * as _ from 'lodash';

export default class Song {
    private _id: string;
    private _name: string;

    public get Id(): string {
        return this._id;
    }
    public get Name(): string {
        return this._name;
    }

    public constructor(id: string, name: string) {
        //if (!id || id === '')
        //    throw new Error('id is required.');

        console.log("hello");

        if (!name || name === '')
            throw new Error('name is required.');

        this._id = (!id || id === '')
            ? _.uniqueId('user_')
            : id;

        this._name = name;

        var a = 1;
    }
}
