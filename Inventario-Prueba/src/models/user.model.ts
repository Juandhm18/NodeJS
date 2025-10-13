import { Table, Column, Model, DataType, BeforeCreate } from "sequelize-typescript";
import bcrypt from "bcrypt";

@Table({
  tableName: "users",
  timestamps: true, // agrega createdAt y updatedAt automáticamente
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM("admin", "analyst"),
    allowNull: false,
    defaultValue: "analyst",
  })
  declare role: "admin" | "analyst";

  @BeforeCreate
  static async hashPassword(instance: User) {
    const salt = await bcrypt.genSalt(10);
    instance.password = await bcrypt.hash(instance.password, salt);
  }
}