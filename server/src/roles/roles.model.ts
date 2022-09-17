import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";
import { UserRole } from "./user-roles.model";

interface RoleCreationAttrs {
    name: string,
    description: string,
}

@Table({tableName: "roles", createdAt: false, updatedAt: false})
export class Role extends Model<Role, RoleCreationAttrs> {
  @Column({type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: false, unique: true})
  name: string;

  @Column({type: DataType.STRING, allowNull: false})
  description: string;

  @BelongsToMany(() => User, () => UserRole)
  users: User[]
}