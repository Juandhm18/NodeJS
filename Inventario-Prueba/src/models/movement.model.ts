import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Warehouse } from "./warehouse.model";
import { Product } from "./product.model";

@Table({
  tableName: "movements",
  timestamps: true,
})
export class Movement extends Model {
  @Column({
    type: DataType.ENUM("entrada", "salida", "traslado"),
    allowNull: false,
  })
  type!: "entrada" | "salida" | "traslado";

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity!: number;

  @ForeignKey(() => Product)
  @Column
  productId!: number;

  @BelongsTo(() => Product)
  product!: Product;

  @ForeignKey(() => Warehouse)
  @Column
  sourceWarehouseId!: number;

  @BelongsTo(() => Warehouse, { foreignKey: "sourceWarehouseId" })
  sourceWarehouse!: Warehouse;

  @ForeignKey(() => Warehouse)
  @Column
  destinationWarehouseId!: number;

  @BelongsTo(() => Warehouse, { foreignKey: "destinationWarehouseId" })
  destinationWarehouse!: Warehouse;
}
