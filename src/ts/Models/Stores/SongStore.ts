import StoreBase from './StoreBase';
import Song from '../Entities/Song';
import { IEnumerable } from 'linq';
import Libraries from '../../Libraries';
import ApiMethods from '../../Definitions/ApiMethods';

export default class SongStore extends StoreBase<Song> {

    //// : IEnumerable<Song>
    //public async GetAll() {
    //    const songs: Song[] = [];
    //    const params = {
    //        // OK - ジャンル一覧
    //        //uri: 'local:directory?type=genre'

    //        // OK - ジャンル上のアルバム一覧
    //        //uri: 'local:directory?genre=AOR'

    //        // OK - アルバム一覧
    //        uri: 'local:directory?type=album'

    //        // OK - アーティスト一覧
    //        //uri: 'local:directory?type=artist'

    //        // OK - アーティストのアルバム一覧 // 10cc
    //        //uri: 'local:artist:md5:c506a38458a1a8f05d96498b72c09e09'

    //        // OK - 全トラック一覧(9万5千件!)
    //        //uri: 'local:directory?type=track'

    //        // NG
    //        //uri: 'local:directory?type=albumartist'

    //        //NG - Query Suceeded, Result Array Null
    //        //uri: 'local:directory?artist=10cc'

            

    //        //NG - Query Suceeded, Result Array Null
    //        //uri: 'local:artist?genre=AOR'
    //        //NG - Application Error
    //        //uri: 'type=artist&genre=AOR'
    //    };
    //    const result = await this.Query(ApiMethods.LibraryBrowse, params);

    //    //const params = {
    //    //    genre: ['AOR'],
    //    //    uris: ['local:directory']
    //    //};
    //    //const result = await this.Query(ApiMethods.LibrarySearch, params);

    //    console.log('Query Result:');
    //    console.log(result);

    //    return result;
    //}
}
