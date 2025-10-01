import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../db/index.js";

interface BookCopyAttributes {
  id: number;
  book_id: number;
  condition: "new" | "good" | "worn";
  availability_status: boolean;
}

type BookCopyCreation = Optional<BookCopyAttributes, "id">;

export class BookCopy extends Model<BookCopyAttributes, BookCopyCreation>
  implements BookCopyAttributes {
  public id!: number;
  public book_id!: number;
  public condition!: "new" | "good" | "worn";
  public availability_status!: boolean;
}

BookCopy.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    condition: {
      type: DataTypes.ENUM("new", "good", "worn"),
      allowNull: false,
    },
    availability_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "book_copies",
    timestamps: false,
  }
);