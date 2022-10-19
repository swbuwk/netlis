import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../../users/users.model";
import { Track } from "./track.model";

interface CommentCreationAttrs {
  authorId: string,
  trackId: string
  text: string
}

@Table({tableName: "comments"})
export class Comment extends Model<Comment, CommentCreationAttrs> {
  @Column({type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => Track)
  @Column
  trackId: string;

  @BelongsTo(() => Track)
  track: Track

  @ForeignKey(() => User)
  @Column
  authorId: string

  @BelongsTo(() => User)
  author: User

  @Column({type: DataType.STRING})
  text: string
}