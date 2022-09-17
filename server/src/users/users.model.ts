import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { Album } from "../albums/albums.model";
import { Role } from "../roles/roles.model";
import { UserRole } from "../roles/user-roles.model";
import { Track } from "../track/models/track.model";

interface UserCreationAttrs {
    id: string
    name: string,
    email: string,
    password: string,
    photo: string,
    mainAlbum: Album
}

@Table({tableName: "users"})
export class User extends Model<User, UserCreationAttrs> {
  @Column({type: DataType.STRING, unique: true, primaryKey: true})
  id: string;

  @Column({type: DataType.STRING, allowNull: false})
  name: string;

  @Column({type: DataType.STRING, allowNull: false, unique: true})
  email: string;

  @Column({type: DataType.STRING, allowNull: false})
  password: string;

  @Column({type: DataType.STRING, allowNull: true})
  photo: string

  @Column({type: DataType.STRING, allowNull: true})
  address: string

  @Column({type: DataType.STRING, allowNull: true})
  bio: string

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[]

  @HasMany(() => Track)
  tracks: Track[]

  @HasOne(() => Album, {as: "mainAlbum"})
  mainAlbum: Album
  
  @HasMany(() => Album, {as: "albums"})
  albums: Album[]
}