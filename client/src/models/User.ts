import { Album } from "./Album";
import { Track } from "./Track";

export interface Role {
    id: number;
    name: string;
    description: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    photo?: any;
    address: string;
    bio: string;
    createdAt: Date;
    updatedAt: Date;
    roles: Role[];
    tracks: Track[];
    mainAlbum: Album;
    albums: Album[];
}