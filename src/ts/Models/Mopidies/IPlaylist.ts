import ITrack from './ITrack';

export default interface IPlaylist {
    uri: string;
    name: string;
    tracks: ITrack[];
    last_modified: number;
}
