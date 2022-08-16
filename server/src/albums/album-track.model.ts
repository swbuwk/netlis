import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Track } from "src/track/models/track.model";
import { Album } from "./albums.model";

interface AlbumTrackCreationAttrs {
    albumId: string,
    trackId: string
}

@Table({tableName: "album_tracks", createdAt: false, updatedAt: false})
export class AlbumTrack extends Model<AlbumTrack, AlbumTrackCreationAttrs> {
  @Column({type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => Album)
  albumId: string

  @ForeignKey(() => Track)
  trackId: string
}