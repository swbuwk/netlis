import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";
import { Role } from "./roles.model";

@Table({tableName: "user_roles", createdAt: false, updatedAt: false})
export class UserRole extends Model<UserRole> {
  @Column({type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true})
  id: number;

  @ForeignKey(() => Role)
  roleId: number

  @ForeignKey(() => User)
  userId: string
}