import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript"
import { AlbumTrack } from "../../albums/album-track.model";
import { Album } from "../../albums/albums.model";
import { User } from "../../users/users.model"
import { Comment } from "./comment.model";

interface TrackCreationAttrs {
    id: string,
    name: string,
    uploaderId: string
    originalAlbumId: string,
    text: string,
    photo: string,
    audio: string,
    private: boolean,
    verified: boolean,
    duration: string
}


@Table({tableName: "tracks"})
export class Track extends Model<Track, TrackCreationAttrs> {
  @Column({type: DataType.STRING, unique: true, primaryKey: true})
  id: string;

  @Column({type: DataType.STRING, allowNull: false})
  name: string;

  @Column({type: DataType.STRING})
  text: string

  @Column({type: DataType.STRING})
  photo: string

  @Column({type: DataType.INTEGER, defaultValue: 0})
  listens: number

  @Column({type: DataType.STRING})
  audio: string

  @Column({type: DataType.STRING})
  duration: string

  @Column({type: DataType.BOOLEAN, defaultValue: false})
  verified: boolean

  @Column({type: DataType.BOOLEAN, defaultValue: false})
  private: boolean

  @ForeignKey(() => User)
  @Column
  uploaderId: string

  @BelongsTo(() => User)
  uploader: User

  @ForeignKey(() => Album)
  @Column({type: DataType.STRING, allowNull: false})
  originalAlbumId: string

  @BelongsToMany(() => Album, () => AlbumTrack)
  albums: Album[]

  @HasMany(() => Comment)
  comments: Comment[]
}