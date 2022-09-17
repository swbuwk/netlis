import { Track } from "./Track";
import { User } from "./User";

export interface Album {
    id: string;
    name: string;
    description: string;
    listens: number;
    photo?: any;
    private: string;
    author: User,
    tracks: Track[],
    createdAt: Date;
    updatedAt: Date;
}
