import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript"
import { Track } from "../track/models/track.model";
import { User } from "../users/users.model"
import { AlbumTrack } from "./album-track.model";

interface AlbumCreationAttrs {
    id: string,
    name: string,
    authorId: string,
    description: string,
    photo: string,
    private: string,
    isMain: boolean
}

@Table({tableName: "albums"})
export class Album extends Model<Album, AlbumCreationAttrs> {
  @Column({type: DataType.STRING, unique: true, primaryKey: true})
  id: string;

  @Column({type: DataType.STRING, allowNull: false})
  name: string;

  @Column({type: DataType.STRING})
  description: string
  
  @Column({type: DataType.INTEGER, defaultValue: 0})
  listens: number

  @Column({type: DataType.STRING})
  photo: string

  @Column({type: DataType.BOOLEAN})
  private: boolean

  @BelongsToMany(() => Track, () => AlbumTrack)
  tracks: Track[]
  
  @Column({type: DataType.BOOLEAN, defaultValue: false})
  isMain: boolean

  @ForeignKey(() => User)
  @Column({type: DataType.STRING, allowNull: false})
  authorId: string

  @BelongsTo(() => User)
  author: User
}