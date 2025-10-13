import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";

@Table({ tableName: "products", timestamps: true})
export class Product extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  code!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  }) stock!: number;
}