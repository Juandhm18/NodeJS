import { Table, Column, Model, DataType, AllowNull, Default } from "sequelize-typescript";

@Table({ tableName: "warehouses", timestamps: true })
export class Warehouse extends Model {
    @AllowNull(false)
    @Column({ type: DataType.STRING})
    name!: string;

    @AllowNull(true)
    @Column({ type: DataType.STRING})
    address!: string;

    @Default(true)
    @Column({ type: DataType.BOOLEAN})
    isActive!: boolean;
}