import { Album } from "./Album";
import { User } from "./User";


export interface Track {
    id: string;
    name: string;
    text: string;
    photo?: any;
    listens: number;
    audio: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    uploader: User;
    originalAlbumId: string;
    albums: Album[];
    comments: any[];
    duration: number
}
